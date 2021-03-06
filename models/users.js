const mongoose = require("mongoose");
const Joi = require("joi");
// const { shippingAddressSchema } = require("./shippingAddress");
// const { paymentMethodSchema } = require("./paymentMethod");

const subscribe_options = ["marketing", "updates", "non"];
const gender_options = ["male", "female", "decline"];

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
    required: false,
    default: "decline",
  },
  verify_code: String,
  verify_code_time: Date,
  is_email_verified: {
    type: Boolean,
    default: false,
  },
  address: {
    type: [mongoose.Types.ObjectId],
    validate: {
      validator: (val) => val.length < 10, //at most 10 address
    },
    default: null,
  },
  paymentMethods: {
    type: [mongoose.Types.ObjectId],
    validate: {
      validator: (val) => val.length < 10, //at most 10 payments
    },
    default: null,
  },
  subscribeId: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
  subscribe: {
    //delete this after integrate the subscribe table
    type: String,
    required: true,
    enum: subscribe_options,
    default: "marketing",
  },
  public_fields: {
    type: [],
    required: true,
    default: ["phone_number", "profile_image", "email"],
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
    .regex(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    )
    .required(),
  gender: Joi.string().valid(gender_options),
};
const edit_profile_schema = {
  name: schema.name,
  bio: schema.bio,
  email: schema.email,
  gender: schema.gender,
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
