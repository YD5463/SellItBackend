const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  platform: {
    required: true,
    type: String,
    enum: ["phone", "email"],
  },
  icon: {
    type: String,
    required: true,
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

exports.Subscription = Subscription;
