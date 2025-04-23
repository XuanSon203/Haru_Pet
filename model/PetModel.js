const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const Schema = mongoose.Schema;
const petSchema = new Schema(
  {
    name: String,
    pet_category_id: { type: String, default: "" },
    sex: String,
    dateOfBirth: { type: Date },
    image: { type: String },
    healthStatus: { type: String },
    description: String,
    deleted: { type: Boolean, default: false },
    age: { type: String, required: true },
    color: String,
    price: Number,
    discount: Number,
    weight: Number,
    height: Number,
    position: Number,
    status: { type: String, default: "active" },
    slug: { type: String, slug: "name", unique: true },
  },
  {
    timestamps: true,
  }
);
const Pet = mongoose.model("pets", petSchema, "pets");
module.exports = Pet;
