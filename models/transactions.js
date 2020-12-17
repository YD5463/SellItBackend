const mongoose = require("mongoose");
const Joi = require("joi");
const { listingSchema } = require("./products/listings");

const transactionSchema = new mongoose.Schema({
  listings: {
    type: [listingSchema], //take a snapshot of the listings
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
  isActive: {
    type: Boolean,
    required: false,
    default: true,
  },
  shippingAddress: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  paymentMethod: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
const buySchema = {
  listingsIds: Joi.object().required(),
  addressId: Joi.string().required(),
  paymentId: Joi.string().required(),
};
exports.Transaction = Transaction;
exports.buySchema = buySchema;
