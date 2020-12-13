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
  icon: {
    required: true,
    type: String,
    default: "mastercard",
  },
});

const paymentMethod = mongoose.model("paymentMethod", paymentMethodSchema);


const Addschema = {
  card_number: Joi.string().required(),
  owner_name:Joi.string().optional(),
  id_number:Joi.string().optional(),
  cvv: Joi.string().required(),
  expireMonth: Joi.number().required().min(1).max(12),
  expireYear: Joi.number().required(),
  type: Joi.string().optional(),
};
const deleteSchema = {
  paymentId: Joi.string().required(),
};
exports.deleteSchema = deleteSchema;
exports.paymentMethod = paymentMethod;
exports.paymentSchema = Addschema;
