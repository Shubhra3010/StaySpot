const Listing = require("../models/listing");
const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const{isLoggedIn,isOwner} = require("../middleware.js");

module.exports.index=async (req, res) => { 
    const allListings = await Listing.find({}); 
    res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req,res)=>{
  res.render("listings/new.ejs");
};

module.exports.showListings =async (req, res) => {
   let { id } = req.params;

    // Check whether id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Page Not Found!");
    }

    const listing = await Listing.findById(id)
    .populate({
        path:"reviews", populate:{
            path:"author",
        },
    })
    .populate("owner");

    // If listing does not exist
    if (!listing) {
        throw new ExpressError(404, "Page Not Found!");
    }
    console.log(listing);
    res.render("listings/show", { listing });
};

module.exports.createListing=async (req, res, next) => {
        let result=listingSchema.validate(req.body);
        console.log(result);

        if(result.error){
            throw new ExpressError(400, result.error);
        }
        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image ={url, filename};
        await newListing.save();
        req.flash("success","New Listing Created");
        res.redirect("/listings");
    };

module.exports.renderEditForm=async (req, res) => {
  let { id } = req.params;
   if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Page Not Found!");
    }

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Page Not Found!");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit", { listing,originalImageUrl });
};

module.exports.updateListing=async (req, res) => { 
    let { id } = req.params; 
    let listing =await Listing.findByIdAndUpdate(id, { ...req.body.listing }); 
      if(typeof req.file !=="undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image ={url, filename};
      await newListing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req, res) => {

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
};