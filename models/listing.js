//here we create list of places what  it contain
const mongoose = require("mongoose");
//define variable
const Schema = mongoose.Schema; 

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
  url: {
    type: String,
    default: "https://images.unsplash.com/photo-1513010963904-2fefe6a92780"
  },
  filename: String
},

    price: Number,
    location: String,
    country: String,
});

//using above schema creating our  model
const Listing = mongoose.model("listing", listingSchema);
//exporting our model app.js
module.exports = Listing;