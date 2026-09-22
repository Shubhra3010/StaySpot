const express= require("express");
const router=express.Router();
const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

const listingController = require("../controllers/listings.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");
const multer  = require("multer");
const{storage}=require("../cloudConfig.js");
const upload = multer({storage });
//Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.

router
 .route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);
//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
     .route("/:id")
    .get(wrapAsync(listingController.showListings))
    .put(
        isLoggedIn, 
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );


// crud mai read operation ke liye use hoga:
// ka kaam hoga individual listing ka data print karwana
// Get req /listings/:id


// Edit route
// /listings/:id/edit -> edit form -> submit
router.get("/:id/edit",
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.renderEditForm));

// req.body ek obj hai jiske andar saare ke saare params hai
// deconstruct karke unn individual values mai convert karenge jisse updated val mai pass kar denge

module.exports = router;
