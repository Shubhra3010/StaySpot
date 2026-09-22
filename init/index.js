const mongoose = require("mongoose");

const initdata = require("./data.js");

const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(async () => {
        console.log("connected to DB");
        await initDB();
        await mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });

//for database creation
async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {

    await Listing.deleteMany({});

    initdata.data = initdata.data.map((obj) => ({
        ...obj,
        owner: "6aaeac73ff6ea3501b233485"
    }));

    await Listing.insertMany(initdata.data);

    console.log("data was initialized");
};

//calling fn