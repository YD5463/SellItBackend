const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Transaction, buySchema } = require("../models/transactions");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");
const { Listings } = require("../models/products/listings");
const { User } = require("../models/users");
const { shippingAddress } = require("../models/shippingAddress");

router.post("/buy", [validateWith(buySchema), auth], async (req, res) => {
  const listingId = req.body.listingId;
  if (!mongoose.isValidObjectId(listingId))
    return res.status(400).send("Invalid listing id!");
  const listing = await Listings.findById(listingId);
  if (!listing) return res.status(404).send("No such listing...");
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

router.get("/adresss", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  const address = [];
  const getAddressPromises = user.address.map(async (addressId) => {
    const curr_addres = await shippingAddress.findById(addressId);
    if (curr_addres) address.push(curr_addres);
  });
  await Promise.all([...getAddressPromises]);
  console.log(address);
  res.status(200).send(address);
});

module.exports = router;
