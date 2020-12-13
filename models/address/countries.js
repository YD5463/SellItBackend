const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  codeName: {
    required: false,
    type: String,
  },
});

const Country = mongoose.model("Country", countrySchema);

exports.Country = Country;
