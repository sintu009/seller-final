const { containerClient } = require("../config/azureBlob");
const { v4: uuidv4 } = require("uuid");

const uploadFilesToAzure = async (files, folderName = "common") => {
  const blobNames = [];

  for (const file of files) {
    const blobName = `${folderName}/${uuidv4()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype
      }
    });

    // ✅ STORE ONLY BLOB NAME (NOT FULL URL)
    blobNames.push(blobName);
  }

  return blobNames;
};

const uploadKycDocuments = async (files, role) => {
  const uploadedDocs = {};

  const folder =
    role === "seller"
      ? "seller-documents"
      : role === "supplier"
      ? "supplier-documents"
      : "common-documents";

  for (const fieldName in files) {
    const file = files[fieldName][0];

    const blobName = `${folder}/${uuidv4()}-${file.originalname}`;

    const blockBlobClient =
      containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype,
      },
    });

    uploadedDocs[fieldName] = blobName;
  }

  return uploadedDocs;
};

module.exports = { uploadFilesToAzure, uploadKycDocuments };
