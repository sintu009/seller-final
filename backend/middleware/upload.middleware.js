const multer = require("multer");

// Memory storage (NO local save)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(
    file.originalname.toLowerCase().split(".").pop()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDF files are allowed"));
  }
};

// Base upload instance
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter
});

// ================= SELLER DOCUMENT UPLOAD =================
const uploadDocuments = upload.fields([
  { name: "gstCertificate", maxCount: 1 },
  { name: "panCard", maxCount: 1 },
  { name: "cancelledCheque", maxCount: 1 }
]);

// ================= PRODUCT IMAGE UPLOAD =================
const uploadProductImages = upload.array("images", 5);

module.exports = {
  upload,
  uploadDocuments,
  uploadProductImages
};
