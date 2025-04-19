const mongoose = require("mongoose");
module.exports.connect = async (req, res) => {
  try {
    await mongoose.connect(process.env.CONNECT_STRING);
    console.log("Connect MongoDB success");
  } catch (error) {
    console.log("Connect MongoDB faile", error);
  }
};
