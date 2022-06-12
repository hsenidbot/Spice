const User =require('../model/user');
const BigPromise = require('../middlewares/bigPromise');
const CustomError = require('../utils/customError');
const cookieToken = require('../utils/cookieToken');
const mailHelper = require("../utils/emailHelper");
const crypto = require("crypto");

exports.signup = BigPromise(async(req, res, next)=>{

  const {name, email, password} = req.body

  if (!email || !name || !password) {
        return next(new CustomError("Name, email and password are required",400));
  }
  const user =await User.create({
      name,
      email,
      password,
      
  });

cookieToken(user,res);

});

exports.login = BigPromise(async(req,res, next)=>{
  const {email, password} = req.body

  //check for email and password
  if(!email || !password){
    return next(new CustomError("Please provide email and password",400));
  }
  const user = await User.findOne({email}).select("+password")

    //get user from db
  if(!user){
    return next(new CustomError("You are not registered in our database",400));
  }
  //match the password
  const isPasswordCorrect = await  user.isValidatedPassword(password);

    //if password do not match
  if(!isPasswordCorrect){
    return next(new CustomError("Email or password does not match or exist",400));
  }
  //if all goes good and we send the token
  cookieToken(user, res);

});

exports.logout = BigPromise(async(req, res, next)=>{
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true
  })
  res.status(200).json({
    sucess: true,
    message: "Logout sucess",
  })
});

exports.forgotPassword = BigPromise(async(req, res, next)=>{
  const {email} = req.body


 const user = await User.findOne({email});
 
 //user not found in a database
 if(!user){
   return next(new CustomError('Email not found as registered', 400))
 }

  // get token from user model methods
 const forgotToken = user.getForgotPasswordToken();

 //save user fields in DB
 await user.save({validateBeforeSave: false});

// create a url
 const myUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`;

 //craft a message
 const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`;

try{
  await mailHelper({
    email: user.email,
    subject: "password reset email",
    messsage
  });

  //json response if email is sucess
  res.status(200).json({
    succes: true,
    message:"email sent successfully",
  });


} catch(error){
  // reset user fields if things goes wrong
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry= undefined;
  await user.save({validateBeforeSave: false});

  return next(new CustomError(error.message, 500));

}


});

exports.passwordReset = BigPromise(async(req, res, next)=>{
  const token = req.params.token

  const encryToken =crypto
  .createHash('sha256')
  .update(token)
  .digest('hex');

 const user = await  User.findOne({
    encryToken,
    forgotPasswordExpiry:{$gt: Date.now()}
  })

  if(!user){
    return next(new CustomError("token is invalid or expired",400))
  }

  if(req.body.password !== req.body.confirmPassword){
    return next(new CustomError("password and confirm password do not match",400));

  }

  user.password = req.body.password

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  // ssend a json response or send token
  cookieToken(user, res);
});


