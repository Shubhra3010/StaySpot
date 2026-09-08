const Joi = require('joi');

//jis schema ko hume validate karna hai
module.exports.listingSchema  = Joi.object({
    listing : Joi.object().required({
        title: Joi.string().required(),
        location:Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("",null)
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
        
    }).required(),
});