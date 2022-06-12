const Food = require("../model/food");
const BigPromise = require("../middleware/bigPromise");
const CustomError = require("../utils/customError"); 
// const cloudinary =require("cloudinary");

exports.addFood =BigPromise(async(req,res,next)=>{
        const {name,price,description}=req.body
})
