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
  content: {
    required: true,
    type: String,
  },
  dateTime: {
    required: true,
    type: Date,
  },
  contentType: {
    required: true,
    type: String,
    default: "text",
  },
  isReceived: {
    required: true,
    type: Boolean,
    default: false,
  },
  isSeen: {
    required: false,
    type: Boolean,
    default: false,
  },
});

const Message = mongoose.model("Messages", messageSchema);

const schema = {
  message: Joi.string().required(),
};

exports.Message = Message;
exports.schema = schema;
