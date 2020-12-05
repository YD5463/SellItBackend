const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const listingMapper = require("../utilities/mapper");
const { Listings } = require("../models/products/listings");

router.get("/listings", auth, async (req, res) => {
  const listings = await Listings.find({ userId: req.user.userId });
  const resources = listings.map(listingMapper.mapListings);
  res.send(resources);
});

module.exports = router;
