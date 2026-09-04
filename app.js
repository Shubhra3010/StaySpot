const express =require("express"); 
const app = express(); 
const mongoose =require ("mongoose"); 
const Listing = require("./models/listing.js"); 
const path = require("path"); 
const methodOverride = require("method-override"); 
const ejsMate = require("ejs-mate"); 
 
 
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; 
 
//for database creation  
async function main(){ 
    await mongoose.connect(MONGO_URL); 
} 
 
app.engine('ejs', ejsMate); 
 
app.set("view engine", "ejs"); 
app.set("views",path.join(__dirname, "views")); 
app.use(express.urlencoded({extended :true})); 
app.use(methodOverride("_method")); 
app.use(express.static(path.join(__dirname, "public"))); 
 
 
 
//creating basic api  
app.get("/",(req,res) => { 
    res.send("Hi I am root"); 
}); 

//Index route 
app.get("/listings", async (req, res) => { 
    const allListings = await Listing.find({}); 
    res.render("listings/index", { allListings });  //  passing data  
}); 

// New Route 
app.get("/listings/new", (req,res) => { 
    //response mai ek new form i.e new.ejs ko render karenge 
    res.render("listings/new"); 
}) 
 
//crud mai read opn ke liye use hoga: 
// ka kaam hoga individual listing ka data print karwana  
//Get req /lisings/:id 

//show route 
app.get("/listings/:id",async(req,res) => { 
    let {id} = req.params; 
    const listing = await Listing.findById(id); 
    res.render("listings/show",{listing}); 
}); 
 
//create route 
app.post("/listings",async (req,res) => { 
    //let (title,description, image,country,location)=req.body; 
    const newListing =new Listing(req.body.listing); 
    await newListing.save(); 
    res.redirect("/listings"); 
}); 
 
//edit route 
///listings/:id/edit->edit form->submit 
app.get("/listings/:id/edit",async (req,res) => { 
    let { id }= req.params; 
    const listing = await Listing.findById(id); 
    res.render("listings/edit",{listing}); 
    }); 
 
//Update route 
app.put("/listings/:id",async(req,res) =>{ 
    let { id }= req.params; 
    await Listing.findByIdAndUpdate(id, {...req.body.listing}) 
    res.redirect(`/listings/${id}`);//yeh show wale route par redirect kar dega 
})// req.body ek obj hai jiske andar saare ke saare params hai 
//deconstruct karke unn individual values mai convert karenge jisse updated val mai pass kar denge 
     
 
//Delete route 
app.delete("/listings/:id", async(req, res)=>{ 
    let { id }= req.params; 
    let deletedListing = await Listing.findByIdAndDelete(id); 
    console.log(deletedListing); 
    res.redirect("/listings"); 
}); 
 
 
// app.get("/testListing",async(req,res)=>{ 
//     let sampleListing = new Listing({ 
//         title: "My New Villa", 
//         description: "By the beach", 
//         price: 1200, 
//         location:"Calangute,Goa", 
//         country: "India", 
//     }); 
 
//     await sampleListing.save(); 
//     console.log("sample  was saved"); 
//     res.send("successful testing"); 
// }); 
 
 
// Start server only after database connection
main() 
.then(()=>{ 
    console.log("connected to DB"); 

    app.listen(3000,()=> { 
        console.log("server is listening to port 3000"); 
    }); 
}) 
.catch((err)=>{ 
    console.log(err); 
});

