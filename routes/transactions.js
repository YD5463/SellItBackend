const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Transaction, buySchema } = require("../models/transactions");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");
const { Listings } = require("../models/products/listings");

router.post("/buy", [validateWith(buySchema), auth], async (req, res) => {
  const listingId = req.body.listingId;
  const listing = await Listings.findById(listingId);
  if (!mongoose.isValidObjectId(listingId))
    return res.status(400).send("Invalid listing id!");
  await Transaction.create({
    listingId,
    purchaseTime: Date.now(),
    userId: req.user.userId,
    listingsPrice: listing.price,
  });
  res.status(201).send("Buying success");
});

router.get("/", auth, async (req, res) => {
  const fromDate = req.params.fromDate;
  const dateFilter = fromDate ? { purchaseTime: { $gte: fromDate } } : {};
  const trans = await Transaction.find(dateFilter);
  res.status(200).send(trans);
});

module.exports = router;
