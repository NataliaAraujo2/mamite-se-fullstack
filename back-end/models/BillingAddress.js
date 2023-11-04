const mongoose = require("mongoose");
const { Schema } = mongoose;

const billingAddressSchema = new Schema(
  {
    userId: mongoose.ObjectId,
    billingAddress: String,
    billingNumber: String,
    billingAdditional: String,
    billingNeighborhood: String,
    billingCity: String,
    billingState: String,
    billingZipCode: String,
  },
  {
    timestamps: true,
  }
);

const BillingAddress = mongoose.model("BillingAddress", billingAddressSchema);

module.exports = BillingAddress;
