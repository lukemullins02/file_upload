const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

const cloud_storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "file_upload",
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "pdf",
      "doc",
      "docx",
      "txt",
      "zip",
    ],
    resource_type: "auto",
  },
});

module.exports = { cloudinary, cloud_storage };
