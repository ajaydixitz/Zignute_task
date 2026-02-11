const mongoose = require("mongoose");
const { deviceType } = require("../helpers/appConstants");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      default: null,
      lowercase: true,
    },
    dob: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    deviceType: {
      type: String,
      default: null,
    },
    deviceToken: {
      type: String,
      default: null,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });
module.exports = mongoose.model("users", userSchema);
