const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    platform: {
      type: String,
      enum: ["Shopify", "Amazon", "Flipkart", "Meesho"],
      required: true,
    },

    storeName: {
      type: String,
      required: true,
      trim: true,
    },

    storeUrl: {
      type: String,
      required: true,
    },

    connectionType: {
      type: String,
      enum: ["direct", "api", "oauth"],
      default: "api",
    },

    credentials: {
      accessToken: String,
      apiKey: String,
      apiSecret: String,
    },

    status: {
      type: String,
      enum: ["Connected", "Disconnected"],
      default: "Connected",
    },

    /** ⭐ NEW FIELD */
    isActive: {
      type: Boolean,
      default: false,
    },

    source: {
      type: String,
      default: "seller_connections",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: Date,
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", storeSchema);
