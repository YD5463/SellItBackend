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
    maxlength: 200,
  },
  expoPushToken: {
    required: false,
    type: String,
  },
  profile_image: {
    required: false,
    type: String,
  },
  activity: {
    type: Map,
    of: String,
    required: false,
  },
  last_login: Date,
  bio: {
    type: String,
    maxlength: 100,
    minlength: 1,
  },
  phone_number: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  verify_code:String,
  verify_code_time:Date,
  is_email_verified:{
    type:Boolean,
    default:false
  }
});

const User = mongoose.model("Users", userSchema);

const schema = {
  name: Joi.string().required().min(2),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
  image_path: Joi.string(),
  bio: Joi.string().max(100),
  phone_number: Joi.string()
    .length(10)
    .regex(/^[0-9]+$/)
    .required(),
};

exports.User = User;
exports.schema = schema;
