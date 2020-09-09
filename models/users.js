const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
  },
  expoPushToken: {
    required: false,
    type: String,
  },
  profile_image: {
    required: false,
    type: String,
  },
});

const User = mongoose.model("Users", userSchema);

const schema = {
  name: Joi.string().required().min(2),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
  image_path: Joi.string(),
};

exports.User = User;
exports.schema = schema;
