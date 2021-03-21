const mongoose = require("mongoose");
const Joi = require("joi");

const statusSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  codeName: {
    required: true,
    type: String,
  },
  color: {
    required: true,
    type: String,
  },
});

const OrderStatus = mongoose.model("OrderStatus", statusSchema);

exports.OrderStatus = OrderStatus;
