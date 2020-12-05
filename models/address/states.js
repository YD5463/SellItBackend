const mongoose = require("mongoose");

const statesSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  codeName: {
    required: true,
    type: String,
  },
  country: {
    required: true,
    type: mongoose.Types.ObjectId,
  },
});

const State = mongoose.model("State", statesSchema);

exports.State = State;
