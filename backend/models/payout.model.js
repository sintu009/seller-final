const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // ADMIN
    },

    payee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // SELLER / SUPPLIER
    },

    payeeRole: {
      type: String,
      enum: ["seller", "supplier"],
      required: true,
    },

    payableAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    payoutStatus: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending",
    },

    payoutMode: {
      type: String,
      enum: ["bank_transfer", "upi", "cash", "cheque"],
    },

    referenceNumber: {
      type: String,
    },
    remarks: {
      type: String,
      trim: true,
    },

    proofImages: [
      {
        type: String, // store image URLs or S3 paths
      },
    ],

    dueDate: {
      type: Date,
    },

    paidAt: {
      type: Date,
    },

    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // admin who processed payout
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

payoutSchema.pre("save", function (next) {
  if (!this.dueDate) {
    const due = new Date();
    due.setDate(due.getDate() + 7);
    this.dueDate = due;
  }

  // Auto payout status logic
  if (this.paidAmount === 0) {
    this.payoutStatus = "pending";
  } else {
    this.payoutStatus = "paid";
    this.paidAt = new Date();
  }

  next();
});

// Indexes
payoutSchema.index({ order: 1 });
payoutSchema.index({ payee: 1, payoutStatus: 1 });
payoutSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Payout", payoutSchema);
