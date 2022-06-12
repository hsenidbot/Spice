const User = require("../model/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const jwt =require("jsonWebToken");

exports.isLoggedIn = BigPromise(async(req, res, next) => {
    const token = 
    req.cookies.token || req.header("Authorization").replace("Bearer","");

    if(!token){
        return next(new CustomError("login first to access this page",401));
    }
const decoded = jwt.verify(token, process.env.JWT_SECRET)

req.user = await User.findById(decoded.id)

next();

});

exports.customRole = (...roles) => {
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new CustomError('You are not allowed for this resouce',403));
        }
        next();
    };
};