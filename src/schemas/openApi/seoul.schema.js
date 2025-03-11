const mongoose = require("mongoose");

const FuneralSchema = new mongoose.Schema({
  url: String,
  title: String,
  address: String,
  phone: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Funeral", FuneralSchema);