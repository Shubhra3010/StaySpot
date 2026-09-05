const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js"); 


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

const validateListing=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
        console.log(result);
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
} 
// Index route
app.get("/listings", wrapAsync(async (req, res) => { 
    const allListings = await Listing.find({}); 
    res.render("listings/index", { allListings });
}));

// New Route
app.get("/listings/new", (req, res) => {
    // response mai ek new form i.e new.ejs ko render karenge
    res.render("listings/new");
});


// crud mai read operation ke liye use hoga:
// ka kaam hoga individual listing ka data print karwana
// Get req /listings/:id


// Show route
app.get("/listings/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;

    // Check whether id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Page Not Found!");
    }

    const listing = await Listing.findById(id);

    // If listing does not exist
    if (!listing) {
        throw new ExpressError(404, "Page Not Found!");
    }

    res.render("listings/show", { listing });
}));


// Create route
app.post(
    "/listings",
    validateListing,
    wrapAsync(async (req, res, next) => {
        let result=listingSchema.validate(req.body);
        console.log(result);
        if(result.error){
            throw new ExpressError(400, result.error);
        }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);


// Edit route
// /listings/:id/edit -> edit form -> submit
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {

    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Page Not Found!");
    }

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Page Not Found!");
    }

    res.render("listings/edit", { listing });
}));


// Update route 
app.put("/listings/:id", 
    validateListing,
    wrapAsync(async (req, res) => { 
    let { id } = req.params; 
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); 
    res.redirect(`/listings/${id}`);
}));
// req.body ek obj hai jiske andar saare ke saare params hai
// deconstruct karke unn individual values mai convert karenge jisse updated val mai pass kar denge



// Delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Page Not Found!");
    }

    let deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
        throw new ExpressError(404, "Page Not Found!");
    }

    console.log(deletedListing);

    res.redirect("/listings");
}));



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