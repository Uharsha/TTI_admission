const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === "application/pdf";

    return {
      folder: "tti_admissions",
      resource_type: isPdf ? "raw" : "image",
      format: isPdf ? "pdf" : undefined,
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
