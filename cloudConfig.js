// const cloudinary = require('cloudinary').v2
// const { CloudinaryStorage } = require('multer-storage-cloudinary');


// cloudinary.config({
//     cloud_name : process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret:process.env.CLOUD_API_SCREAT
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "chatImages",
//     format: ["png","jpg","pdf"]
//   },
// });

// module.exports ={ cloudinary, storage};

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chatImages",
    allowed_formats: ["png", "jpg", "jpeg", "pdf"], // ✅ ARRAY
  },
});

module.exports = { cloudinary, storage };
