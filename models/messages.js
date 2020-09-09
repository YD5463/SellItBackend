/*
fromUserId: req.user.userId,
    toUserId: listing.userId,
    listingId,
    content: message,
*/

const mongoose = require("mongoose");
const Joi = require("joi");

const messageSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  toUserId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  listingId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  content: {
    required: true,
    type: String,
  },
  dateTime: {
    required: true,
    type: Date,
  },
});

const Message = mongoose.model("Messages", messageSchema);

const schema = {
  listingId: Joi.number().required(),
  message: Joi.string().required(),
};

exports.Message = Message;
exports.schema = schema;
