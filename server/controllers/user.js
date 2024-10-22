const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const sendMail = require("../ulttils/sendMail");
const crypto = require("crypto");

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({
      success: false,
      mess: "Missing input",
    });
  }

  const user = await User.findOne({ email: email });

  if (user) throw new Error("User has been existed!");
  else {
    const newUser = await User.create(req.body);

    return res.status(200).json({
      success: newUser ? true : false,
      mess: newUser
        ? "Register Successfully,Please login!"
        : "Something went wrong",
    });
  }
});

//Refresh token => cấp mới access token
//Access token => xác thực người dùng, phân quyền người dùng
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      mess: "Missing input",
    });
  }

  const response = await User.findOne({ email: email });
  // ở đây response đã trả về một đối tượng User nên có thể sử dụng là một object để sử dụng hàm isCorrectResponse

  if (response && (await response.isCorrectPassword(password))) {
    //tách password và role ra khỏi response
    const { role, password, refreshToken, ...userData } = response.toObject();
    //tạo access token
    const accessToken = generateAccessToken(response._id, role);
    // tạo refresh token
    const newRefreshToken = generateRefreshToken(response._id);
    //Lưu refresh token vào database
    const updatetedUSer = await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    //Lưu refresh token vào cookie
    if (!updatetedUSer) {
      return res.status(500).json({
        success: false,
        mess: "Failed to update refresh token in database",
      });
    }

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      axAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userDatas: userData,
    });
  } else {
    throw new Error("Authentication failed");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-refreshToken -password -role");

  return res.status(200).json({
    success: user ? true : false,
    result: user ? user : "Can not found User!!",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //lấy token từ trình duyệt
  const cookie = req.cookies;
  //check xem có token không
  if (!cookie || !cookie.refreshToken) {
    throw new Error("No refresh token in cookies");
  }
  //check token có hợp lệ không
  const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  //check Refreshtoken có trùng với Refeshtoken đã lưu trong db không
  const response = await User.findOne({
    _id: result._id,
    refreshToken: cookie.refreshToken,
  });

  const newAccessToken = generateAccessToken(response._id, response.role);
  return res.status(200).json({
    success: true,
    newAccessToken: response
      ? newAccessToken
      : "Refresh Token not matched database",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie || !cookie.refreshToken) {
    throw new Error("No refresh token in cookie");
  }
  //xóa refreshToken ở db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  //xóa refreshtoken ở trình duyệt
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    status: true,
    mess: "Logout successfully",
  });
});

// Client gửi email
// Server check email có hợp lệ hay không => Gửi mail + kèm theo link (password change token)
// Client check mail => click link
// Client gửi api kèm token
// Check token có giống với token mà server gửi mail hay không
// Change password

// const forgotPassword = asyncHandler(async(req,res)=>{
//     const { email } = req.query

//     if(!email) throw new Error('Missing email')
//         const user = await User.findOne({email: email})
//     if(!user) throw new Error('Can not found user!')

//         const resetToken = user.createPasswordChangedToken()
//         await user.save()

//         const html = `Xin vui lòng click vào link dưới đây để đổi mật khẩu của bạn
//         Link này sẽ hết hạn sau 15 phút kể từ bây giờ.<a href=${process.env.URL_SERVER}/api/user/${resetToken}>Click here</a>`

// const data = {
//     email,
//     html
// }
//         const result = await sendGmail(data)
//         return res.status(200).json({
//             success: true,
//             result: result
//         })
// })

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`;

  const data = {
    email,
    html,
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: true,
    rs,
  });
});
const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;

  if (!password || !token) throw new Error("Missing input!!");

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  if (!user) throw new Error("Reset password token invalid!!");

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangeAt = Date.now();
  user.passwordResetExpire = undefined;

  await user.save();

  return res.status(200).json({
    success: user ? true : false,

    mess: user ? "Changed Password Successfully!!" : "Something went wrong.",
  });
});

const getAllUser = asyncHandler(async (req, res) => {
  const user = await User.find().select("-refreshToken -password -role");
  return res.status(200).json({
    success: user ? true : false,
    users: user,
  });
});

const delUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;

  if (!_id) throw new Error("Missing Input");

  const response = await User.findByIdAndDelete(_id);

  return res.status(200).json({
    success: response ? true : false,
    message: response
      ? `User with email ${response.email} deleted.`
      : "No user deleted!!",
  });
});

const updUser = asyncHandler(async (req, res) => {
  //req.body laf một object
  const { _id } = req.user;

  if (!_id || Object.keys(req.body).length === 0) {
    throw new Error("Missing input!");
  }

  const response = await User.findByIdAndUpdate(_id, req.body, { new: true });

  return res.status(200).json({
    success: response ? true : false,
    dataUpdated: response ? response : "Something went wrong",
  });
});

const updUserById = asyncHandler(async (req, res) => {
  const { uid } = req.params;

  if (Object.keys(req.body).length === 0) {
    throw new Error("Missing input!");
  }

  const response = await User.findByIdAndUpdate(uid, req.body, { new: true });

  return res.status(200).json({
    success: response ? true : false,
    dataUpdated: response ? response : "Something went wrong",
  });
});
const updAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  if (!req.body.address) throw new Error("Missing input");

  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    { new: true }
  );

  return res.status(200).json({
    success: response ? true : false,
    dataUpdated: response ? response : "Something went wrong",
  });
});

const addToCart = asyncHandler(async (req, res) => {
  const { pid, color, quantity } = req.body;

  const { _id } = req.user;
  if (!pid || !color || !quantity) throw new Error("Missing input");

  const user = await User.findById(_id).select("cart");
  if (!user) return res.status(404).json({ message: "User not found" });
  if (quantity <= 0) throw new Error("Quantity must be greater than 0");

  const cart = user?.cart?.find((el) => el.product.toString() === pid && el.color === color);
  if (cart) {  
      cart.quantity += +quantity;
      await user.save();
      return res.status(200).json({
        status:  true,
        mess:"Updated cart successfully"
      });
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { cart: { product: pid, quantity, color } } },
      { new: true }
    );
    return res.status(200).json({
      status: response ? true : false,

      mess: response ? response : "Add to cart failed!",
    });
  }
});

module.exports = {
  register,
  login,
  getCurrentUser,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getAllUser,
  delUser,
  updUser,
  updUserById,
  updAddress,
  addToCart,
};
