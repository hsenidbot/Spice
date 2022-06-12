const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt =require('jsonwebtoken');
const crypto =require('crypto');

const restaruantSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength : [8, 'password should be 8 char'],
        select: false
    },
    table:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:[
                'Open',
                'Closed'
            ],
            message:'please selct category from the above'
        }
    },
    qrCode:[
        
    ]
   
})
//encryption

   restaruantSchema.pre('save',async function(next){
        if(!this.isModified('password')){
            return next();
        }
        this.password = await bcrypt.hash(this.password, 10)
    })


//validation of password
restaruantSchema.methods.isValidatedPassword = async function(usersendPassword){
    return await  bcrypt.compare(usersendPassword, this.password)
  };

   //create and return jwt token
   restaruantSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_RESTARUANT,{
         expiresIn: process.env.JWT_EXPIRY_RESTARUANT
     })
 };
 
 //generate forgot password token(string)
 restaruantSchema.methods.getForgotPasswordToken = function(){
     //generate a long random string
     const forgotToken = crypto.randomBytes(20).toString('hex');
     
     //getting a hash -make sure to get a hash on backend
     this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');
 
     //time of token
     this.forgotPasswordExpiry = Date.now() + 20 * 60* 1000
 
     return forgotToken;
 }


 
module.exports= mongoose.model("Restaruant", restaruantSchema);