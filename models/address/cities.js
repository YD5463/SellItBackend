const mongoose = require("mongoose");

const cityShchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  state: {
    required: false,
    type: mongoose.Types.ObjectId,
  },
  country: {
    required: true,
    type: mongoose.Types.ObjectId,
  },
});

const City = mongoose.model("City", cityShchema);

exports.City = City;
