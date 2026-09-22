const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//configure means to join the backend from cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
 api_key: process.env.CLOUD_API_KEY,
api_secret:process.env.CLOUD_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'StaySpot_DEV',
    allowedformats: ["png","jpg","jpeg"],
  },
});

module.exports={
    cloudinary,
    storage,
};