const express = require("express");
const router = express.Router()
const {qrCode}=require("../controller/qr");
const { isLoggedIn} = require("../middlewares/login");


router.route('/generateQrForMyRestaruant').post(isLoggedIn,qrCode)

module.exports =router;