const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  description: String,
  pricePerShare: Number,
  availableShares: Number,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Stock", stockSchema);
