const mongoose = require("mongoose");
const generate = require("../helper/generate");
const Schema = mongoose.Schema;

const userShema = new Schema(
  {
    fullName: { type: String },
    email: String,
    password: String,
    tokenUser: {
      type: String,
      default: generate.generateRandomString(20),
    },
    phone: String,
    avatar: String,
    status: {
      type: String,
      default: "active",
    },
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", userShema, "users");

module.exports = User;
