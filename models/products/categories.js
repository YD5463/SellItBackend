const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  icon: {
    required: true,
    type: String,
  },
  backgroundColor: {
    required: true,
    type: String,
  },
  color: {
    required: true,
    type: String,
  },
});

const Categories = mongoose.model("Categories", categorySchema);

exports.Categories = Categories;
