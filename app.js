if(process.env.NODE_ENV !="production"){
   require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");
const { reviewSchema } = require("./schema.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// for database creation
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions={
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: new Date(Date.now() + 7 * 24 *60*60*1000),
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    },     
};

// creating basic api -API: A way for two different software/applications to communicate with each other.
//Real life: Waiter in a restaurant takes your order to the kitchen and brings the food back → Waiter = API.
app.get("/", (req, res) => {
    res.send("Hi I am root");
});
//middleware-Middleware: A function that runs between the request and the final response to perform some task.
//Real life: Security guard checks your ID before letting you enter a building → Security guard = Middleware.
app.use(session(sessionOptions));
app.use(flash());

//jab bhi koi req aaye hum passport ko initialze karde as a middleware
app.use(passport.initialize());
app.use(passport.session());// a web application needs the ability to identify users as they browse from page to page
//this series of req & res each assocate with the same user is known as Session.
passport.use(new LocalStrategy(User.authenticate()));

//serialize- store the info from user
//deserializer- remove the info from user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//creating local middleware
app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next(); // next ko call karna nhi bhulna nhi toh isi middleware par stuck ho jayenge
});
// app.get("/demouser",async(req,res)=>{
//     console.log("DEMO USER ROUTE HIT");
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser= await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute,Goa",
//         country "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });



// if route is not there standard err we have to send
app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


// Error handling middleware
app.use((err, req, res, next) => {
 
    let {
        statusCode = 500,
        message = "Something Went Wrong!"
    } = err;
res.status(statusCode).render("error.ejs",{message});
    //res.status(statusCode).send(message);
});



// Start server only after database connection
main()
    .then(() => {

        console.log("connected to DB");

        app.listen(3000, () => {
            console.log("server is listening to port 3000");
              });

    })
    .catch((err) => {
        console.log(err);
    });