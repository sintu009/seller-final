// controllers/fileController.js
const {
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential
} = require("@azure/storage-blob");

const getSasUrl = async (req, res) => {
  try {
    let { blobName } = req.query;
    if (!blobName) {
      return res.status(400).json({ message: "blobName required" });
    }

    blobName = decodeURIComponent(blobName);

    const credential = new StorageSharedKeyCredential(
      process.env.AZURE_STORAGE_ACCOUNT_NAME,
      process.env.AZURE_STORAGE_ACCOUNT_KEY
    );

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: process.env.AZURE_CONTAINER_NAME,
        blobName,
        permissions: BlobSASPermissions.parse("r"),
        expiresOn: new Date(Date.now() + 10 * 60 * 1000)
      },
      credential
    ).toString();

    const sasUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_CONTAINER_NAME}/${blobName}?${sasToken}`;

    res.json({ sasUrl });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSasUrl };
