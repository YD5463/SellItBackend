const express = require("express");
const router = express.Router();
const multer = require("multer");

const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const imageResize = require("../middleware/imageResize");
const mapper = require("../utilities/mapper");
const config = require("config");
const { Categories } = require("../models/products/categories");
const { schema, Listings } = require("../models/products/listings");
const { sendNewListingEmail } = require("../utilities/mailer");
const reqLimits = require("../middleware/reqLimits");

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const validateCategoryId = async (req, res, next) => {
  const category = await Categories.findById(req.body.categoryId);
  if (!category) return res.status(400).send({ error: "Invalid categoryId." });

  next();
};

router.get("/", async (req, res) => {
  const listings = await Listings.find().select("-__v");
  const resources = listings.map(mapper.mapListings);
  res.send(resources);
});

router.post(
  "/",
  [
    // Order of these middleware matters.
    // "upload" should come before other "validate" because we have to handle
    // multi-part form data. Once the upload middleware from multer applied,
    // request.body will be populated and we can validate it. This means
    // if the request is invalid, we'll end up with one or more image files
    // stored in the uploads folder. We'll need to clean up this folder
    // using a separate process.
    auth,
    reqLimits.byIp,
    upload.array("images", config.get("maxImageCount")),
    validateWith(schema),
    validateCategoryId,
    imageResize.resize_images,
  ],

  async (req, res) => {
    let listing = {
      title: req.body.title,
      price: parseFloat(req.body.price),
      categoryId: req.body.categoryId,
      description: req.body.description,
      images: req.images,
    };

    if (req.body.location) listing.location = JSON.parse(req.body.location);
    if (req.user) listing.userId = req.user.userId;
    listing = await Listings.create(listing);
    sendNewListingEmail(listing, req.user.userId);
    res.status(201).send(listing);
  }
);

module.exports = router;
