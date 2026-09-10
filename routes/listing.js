const express= require("express");
const router=express.Router();
const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
        console.log(error);
    if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressError(400,errMsg);
    } else{
      next();
    }
};

// Index route
router.get("/", wrapAsync(async (req, res) => { 
    const allListings = await Listing.find({}); 
    res.render("listings/index", { allListings });
}));

// New Route
router.get("/new", (req, res) => {
    // response mai ek new form i.e new.ejs ko render karenge
    res.render("listings/new");
});

// crud mai read operation ke liye use hoga:
// ka kaam hoga individual listing ka data print karwana
// Get req /listings/:id



// Show route
router.get("/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;

    // Check whether id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Page Not Found!");
    }

    const listing = await Listing.findById(id).populate("reviews");

    // If listing does not exist
    if (!listing) {
        throw new ExpressError(404, "Page Not Found!");
    }

    res.render("listings/show", { listing });
}));

// Create route
router.post(
    "/",
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
router.get("/:id/edit", wrapAsync(async (req, res) => {

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
router.put("/:id", 
    validateListing,
    wrapAsync(async (req, res) => { 
    let { id } = req.params; 
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); 
    res.redirect(`/listings/${id}`);
}));
// req.body ek obj hai jiske andar saare ke saare params hai
// deconstruct karke unn individual values mai convert karenge jisse updated val mai pass kar denge



// Delete route
router.delete("/:id", wrapAsync(async (req, res) => {

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

module.exports = router;
