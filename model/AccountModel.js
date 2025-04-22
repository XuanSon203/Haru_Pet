const mongoose = require("mongoose");
const generate = require("../helper/generate");
const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    fullName: { type: String },
    email: String,
    password: String,
    token: {
      type: String,
      default: generate.generateRandomString(20),
    },
    phone: String,
    avatar: String,
    role_id: String,
    status: String,
    position: Number,
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Đặt tên collection là 'products'
const Account = mongoose.model("accounts", accountSchema, "accounts");

module.exports = Account;
