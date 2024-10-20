const Coupon = require("../models/coupon");

const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("Missing input!");

  const response = await Coupon.create({
    ...req.body,
    expiry: Date.now() + expiry * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Created Coupon failed",
  });
});

const getCoupon = asyncHandler(async (req, res) => {
  const response = await Coupon.find();

  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Get Coupon failed",
  });
});
const delCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const dataDeleted = await Coupon.findByIdAndDelete(cid);

  return res.status(200).json({
    status: dataDeleted ? true : false,
    mess: dataDeleted ? dataDeleted : "Delete brand failed!",
  });
});

const updCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input!");
  if (req.body.expiry)
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
  const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });

  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Created Coupon failed",
  });
});
module.exports = {
  createCoupon,
  getCoupon,
  delCoupon,
  updCoupon,
};
