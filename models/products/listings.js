const mongoose = require("mongoose");
const Joi = require("joi");

// const filenameSchema = new mongoose.Schema({
//   filename: {
//     type: Map,
//     of: String,
//   },
// });

const locationDetailSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const listingSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  images: [String],
  categoryId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  price: {
    required: true,
    type: Number,
  },
  description: {
    type: String,
    required: false,
  },
  userId: {
    required: false,
    type: mongoose.Schema.Types.ObjectId,
  },
  location: {
    type: locationDetailSchema,
    required: false,
  },
});

const Listings = mongoose.model("listings", listingSchema);

const schema = {
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  price: Joi.number().required().min(1),
  categoryId: Joi.string().required().min(1),
  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).optional(),
};

exports.listingSchema = listingSchema;
exports.Listings = Listings;
exports.schema = schema;
