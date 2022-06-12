const express =require("express");
const Router = express.Router();

const {addRestaruant,restaruantLogin,restaruantLogout,
    forgotPassword,
    passwordReset,
    updateRestaruantDetails}=require('../controller/restaruant');

    Router.route('/restaruantSignup').post(addRestaruant);
    Router.route('/restaruantLogin').post(restaruantLogin);
    Router.route('/restaruantLogout').post(restaruantLogout);
    Router.route('/forgotPassword').post(forgotPassword);
    Router.route('/passwordReset,').post(passwordReset);
    Router.route('/updateRestaruantDetails').post(updateRestaruantDetails);

module.exports =Router;