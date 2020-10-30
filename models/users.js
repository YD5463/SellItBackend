const mongoose = require("mongoose");
const Joi = require("joi");

const subscribe_options = ["marketing", "updates", "non"];
const gender_options = ["male", "female"];

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
    enum: gender_options,
  },
  verify_code: String,
  verify_code_time: Date,
  is_email_verified: {
    type: Boolean,
    default: false,
  },
  subscribe: {
    type: String,
    enum: subscribe_options,
    default: "marketing",
  },
});

const User = mongoose.model("Users", userSchema);

const schema = {
  name: Joi.string().required().min(2).max(20),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5).max(20),
  image_path: Joi.string(),
  bio: Joi.string().max(100),
  phone_number: Joi.string()
    .length(10)
    .regex(/^[0-9]+$/)
    .required(),
  gender: Joi.string().valid(gender_options),
};
const edit_profile_schema = {
  name: schema.name,
  bio: schema.bio.required(),
  gender: schema.gender.required(),
  phone_number: schema.phone_number,
};

const change_pass_schema = {
  curr_password: schema.password,
  new_password: schema.password,
};
const change_subscription_schema = {
  subscribe: Joi.string().valid(subscribe_options).required(),
};

const forgot_password_schema = {
  email: schema.email,
};

exports.User = User;
exports.schema = schema;
exports.change_pass_schema = change_pass_schema;
exports.edit_profile_schema = edit_profile_schema;
exports.change_subscription_schema = change_subscription_schema;
exports.forgot_password_schema = forgot_password_schema;
