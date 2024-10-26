const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  aadhar: String,
  pan: String,
  username: String,
  phone: String,
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
