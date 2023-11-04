const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userId: mongoose.ObjectId,
    deliveryAddress: String,
    deliveryNumber: String,
    deliveryAdditional: String,
    deliveryNeighborhood: String,
    deliveryCity: String,
    deliveryState: String,
    deliveryZipCode: String,
  },
  {
    timestamps: true,
  }
);

const DeliveryAddress = mongoose.model("DeliveryAddress", userSchema);

module.exports = DeliveryAddress;
