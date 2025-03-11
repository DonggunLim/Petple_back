const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const WalkSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: "users", required: true },
  pet: { type: ObjectId, ref: "pets", required: true },
  startTime: { type: Date, required: true },
  startLocation: {
    address: { type: String, required: true },
    buildingName: { type: String, default: "건물명 없음" },
  },
  endTime: { type: Date, required: true },
  endLocation: {
    address: { type: String, required: true },
    buildingName: { type: String, default: "건물명 없음" },
  },
  duration: { type: String } 
});

module.exports = mongoose.model("Walk", WalkSchema);