//here we create list of places what  it contain
const mongoose = require("mongoose");
//define variable
const Schema = mongoose.Schema; 
const Review= require("./review.js");

const listingSchema = new Schema({
    title :{
        type: String,
        required: true,
    },
    description: String,
    // hum set and arrow fn ki madad se img ki default value set kar rahe 
    //using ternary op which acts like if and else
       //? it shows condition is complete 
    // result basis on true shows on left side link and false on right (v)

    image: {
      url:String,
      filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },
  // category: {  // iska backend implement karna hai
  //   type : String,
  //   enum: ["mountains", "farms", "deserts"]
  // }
});

//CREATING POST MONGOOSE MIDDLEWARE in which if listings get deleted so reviews get also delete for them
listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews}});
  }
});

//using above schema creating our  model
const Listing = mongoose.model("listing", listingSchema);
//exporting our model app.js
module.exports = Listing;