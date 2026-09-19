const mongoose = require("mongoose");
//define variable
const Schema = mongoose.Schema; 
const passportLocalMongoose = require("passport-local-mongoose").default;
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});
// idhar plugin isliye use kiya hai kyuki yeh automatically 
//username,hashing,salting and hash password automatically implement kar deta hai 
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);