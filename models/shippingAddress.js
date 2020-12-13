const mongoose = require("mongoose");
const Joi = require("joi");

const shippingAddressSchema = new mongoose.Schema({
  city: {
    required: true,
    type: String,
  },
  state: {
    required: true,
    type: String,
  },
  postal_code: {
    required: true,
    type: String,
  },
  country: {
    required: true,
    type: String,
  },
  street: {
    required: true,
    type: String,
  },
});

const shippingAddress = mongoose.model(
  "shippingAddress",
  shippingAddressSchema
);

const schema = {
  city: Joi.required(),
  state: Joi.required(),
  postal_code: Joi.optional(),
  country: Joi.required(),
  street: Joi.required(),
};

// exports.shippingAddressSchema = shippingAddressSchema;
exports.addressSchema = schema;
exports.shippingAddress = shippingAddress;