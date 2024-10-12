const express = require('express');
require('dotenv').config();
const dbConnect = require('./config/dbconnect')
const initRoutes = require('./routes/index')
const cookieParser = require('cookie-parser')

const app = express();
app.use(cookieParser())

const port = process.env.PORT || 8888;

app.use(express.json());// đọc hiểu data json của cilent gửi lên
app.use(express.urlencoded({ extended: true }));
dbConnect()

initRoutes(app)

app.listen(port, () => {
    console.log('Server running on the port ' + port);
});
