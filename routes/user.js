const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync= require("../utils/wrapAsync");
const passport= require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController= require("../controllers/users.js");

router
.route("/signup")
.get(userController.renderSignupForm )
.post(wrapAsync(userController.signup));

router
.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{ 
        failureRedirect: "/login",
        failureFlash:true, 
    }), 
    userController.login
);

//async req hogi kyuki hume DB se check karna padega ki user exist karta hai ki nhi
router
router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
    
})

module.exports = router;