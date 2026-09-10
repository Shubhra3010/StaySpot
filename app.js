const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


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



// creating basic api
app.get("/", (req, res) => {
    res.send("Hi I am root");
});





const validateReview=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
        console.log(error);
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
};

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);




// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute,Goa",
//         country: "India",
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