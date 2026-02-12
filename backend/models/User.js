const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["HEAD", "TEACHER"], required: true },
  course: {
    type: String,
    required: function () {
      return this.role === "TEACHER";
    },
  },
});

module.exports = mongoose.model("User", userSchema);
