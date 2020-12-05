const mongoose = require("mongoose");
const Joi = require("joi");

const paymentMethodSchema = new mongoose.Schema({
  card_number: {
    required: true,
    type: String,
  },
  expireMonth: {
    required: true,
    type: String,
  },
  expireYear: {
    required: true,
    type: String,
  },
  cvv: {
    required: true,
    type: String,
  },
  type: {
    required: false,
    type: String,
    default: "Credit Card",
  },
});

const paymentMethod = mongoose.model("paymentMethod", paymentMethodSchema);

const schema = {
  card_number: Joi.string().required(),
  cvv: Joi.string().required(),
  expireMonth: Joi.number().required().min(1).max(12),
  expireYear: Joi.number().required(),
  type: Joi.string().optional(),
};
// exports.paymentMethodSchema = paymentSchema;
exports.paymentMethod = paymentMethod;
exports.paymentSchema = schema;
