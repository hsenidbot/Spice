const express = require("express");
const app =express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

const user = require("./routes/user");
const restaruant =require("./routes/restaruant");
const qr=require("./routes/qr");

app.use("/api", user);
app.use("/api", restaruant);
app.use("/api",qr);

module.exports=app;
