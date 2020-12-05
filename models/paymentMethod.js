const mongoose = require("mongoose");
const Joi = require("joi");

const paymentMethodSchema = new mongoose.Schema({
  card_number: {
    required: true,
    type: String,
    validate: {
      validator: (value) => /\d{16}/.test(value),
    },
  },
  expireMonth: {
    required: true,
    type: Number,
    min: 1,
    max: 12,
  },
  expireYear: {
    required: true,
    type: Number,
    // min: Date.now().getFullYear(),
    // max: Date.now().getFullYear() + 30,
  },
  cvv: {
    required: true,
    type: String,
    validate: {
      validator: (value) => /\d{3}/.test(value),
    },
  },
  type: {
    required: true,
    type: String,
  },
});

const paymentMethod = mongoose.model("paymentMethod", paymentMethodSchema);

const schema = {
  card_number: Joi.string().required(),
  cvv: Joi.string().required(),
  expireMonth: Joi.number().required().min(1).max(12),
  expireYear: Joi.number().required(),
  type: Joi.string().required(),
};
// exports.paymentMethodSchema = paymentSchema;
exports.paymentMethod = paymentMethod;
exports.paymentSchema = schema;
