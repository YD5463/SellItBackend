const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const mapper = require("../utilities/mapper");
const { Listings } = require("../models/products/listings");

router.get("/:id", auth, async (req, res) => {
  const listing = await Listings.findById(req.params.id);
  if (!listing) return res.status(404).send();
  const resource = mapper.mapListings(listing);
  res.send(resource);
});

module.exports = router;
