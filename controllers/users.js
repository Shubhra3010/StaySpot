const User = require("../models/user.js");

module.exports.renderSignupForm =(req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.signup = async (req, res, next) => {
    try {
        console.log("1. Signup controller started");

        const { username, email, password } = req.body;
        const newUser = new User({ email, username });

        console.log("2. Registering user:", username);

        const registeredUser = await User.register(newUser, password);

        console.log("3. User registered successfully");

        req.login(registeredUser, (err) => {
            if (err) {
                console.log("Login session error:", err);
                return next(err);
            }

            console.log("4. Signup login successful");

            req.flash("success", "Welcome to StaySpot");
            return res.redirect("/listings");
        });
    } catch (err) {
        console.log("SIGNUP ERROR:", err);
        req.flash("error", err.message);
        return res.redirect("/signup");
    }
};


module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to StaySpot! You are logged in!");

    const redirectUrl = res.locals.redirectUrl || "/listings";

    delete req.session.redirectUrl;

    res.redirect(redirectUrl);
};
