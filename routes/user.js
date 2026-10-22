
const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync= require("../utils/wrapAsync");
const passport= require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController= require("../controllers/users.js");

router
.route("/signup")
.get(userController.renderSignupForm)
.post((req, res, next) => {
    console.log("SIGNUP POST ROUTE HIT");
    console.log("Form fields received:", Object.keys(req.body));
    next();
}, userController.signup);

router
.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            console.log("Passport error:", err);
            console.log("User found:", !!user);
            console.log("Passport info:", info?.message);

            if (err) return next(err);

            if (!user) {
                req.flash("error", info?.message || "Login failed");
                return res.redirect("/login");
            }

            req.logIn(user, (err) => {
                if (err) return next(err);

                console.log("Authenticated:", req.isAuthenticated());

                req.flash("success", "Welcome back to StaySpot!");
                const redirectUrl = res.locals.redirectUrl || "/listings";
                delete req.session.redirectUrl;

                res.redirect(redirectUrl);
            });
        })(req, res, next);
    }
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