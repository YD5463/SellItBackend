const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Transaction, buySchema } = require("../models/transactions");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");
const { Listings } = require("../models/products/listings");
const { User } = require("../models/users");
const { shippingAddress } = require("../models/shippingAddress");
const { sendNewTransactionAlert } = require("../utilities/mailer");
const { paymentMethod } = require("../models/paymentMethod");
const { OrderStatus } = require("../models/orderStatus");

/**
 * the buy action is atomic - means if one of the product don't exists
 * the whole buy will be canceld
 */
router.post("/buy", [validateWith(buySchema), auth], async (req, res) => {
  let total_price = 0;
  const { addressId, paymentId, listingsIds } = req.body;
  let listings = [];
  if (
    !mongoose.isValidObjectId(addressId) ||
    !mongoose.isValidObjectId(paymentId)
  ) {
    return res.status(404).send("Invalid Id...");
  }
  const address = await shippingAddress.findById(addressId);
  const payment = await paymentMethod.findById(paymentId);
  if (!address || !payment)
    return res.status(404).send("No such address or payment...");
  let totalQuantity = 0;
  for (let [listingId, quanity] of Object.entries(listingsIds)) {
    if (!mongoose.isValidObjectId(listingId))
      return res.status(400).send("Invalid listing id!");
    const listing = await Listings.findById(listingId);
    if (!listing) return res.status(404).send("No such listing...");
    listings.push(listing);
    totalQuantity += quanity;
    total_price += listing.price * quanity;
  }
  address.inUse = true;
  payment.inUse = true;
  const status = await OrderStatus.findOne({ codeName: "P" });
  await address.save();
  await payment.save();
  await Transaction.create({
    listings: listings,
    purchaseTime: Date.now(),
    userId: req.user.userId,
    listingsPrice: total_price,
    shippingAddress: addressId,
    paymentMethod: paymentId,
    quantity: totalQuantity,
    status: status._id,
  });
  sendNewTransactionAlert(req.user.userId, { listings, address });
  res.status(201).send("Buying success");
});

router.get("/orderedListings", auth, async (req, res) => {
  const fromDate = req.params.fromDate;
  const dateFilter = fromDate ? { purchaseTime: { $gte: fromDate } } : {};
  const trans = await Transaction.find(
    Object.assign({ userId: req.user.userId, isActive: true }, dateFilter)
  );
  res.status(200).send(trans);
});

router.get("/statuses", auth, async (req, res) => {
  const statuses = await OrderStatus.find({});
  res.status(200).send(statuses);
});
router.put("/changeStatus", auth, async (req, res) => {});

module.exports = router;
