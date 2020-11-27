const mongoose = require("mongoose");
const Joi = require("joi");

const transactionSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  purchaseTime: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  listingsPrice: {
    type: Number,
    required: true,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
const buySchema = {
  listingId: Joi.string().required(),
};
exports.Transaction = Transaction;
exports.buySchema = buySchema;
