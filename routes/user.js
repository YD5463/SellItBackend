const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { User } = require("../models/users");
const { Listings } = require("../models/listings");
const mongoose = require("mongoose");
const mapper = require("../utilities/mapper");
const validateWith = require("../middleware/validation");
const { addressSchema, shippingAddress } = require("../models/shippingAddress");
const { paymentSchema, paymentMethod } = require("../models/paymentMethod");
const { User } = require("../models/users");

const cryptojs = require("crypto");

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.status(200).send({
    userId: user._id,
    email: user.email,
    name: user.name,
    bio: user.bio,
    phone_number: user.phone_number,
    gender: user.gender,
    profile_image: user.profile_image
      ? mapper.mapImageToUrl(user.profile_image)
      : null,
  });
});
router.get("/:id", auth, async (req, res) => {
  const userId = req.params.id;
  if (!mongoose.isValidObjectId(userId))
    return res.status(400).send("invalid user id!");
  const user = await User.findById(userId);
  if (!user) return res.status(404).send("user not exists");

  const listings = await Listings.find({ userId });
  res.status(200).send({
    id: user._id,
    name: user.name,
    email: user.email,
    listings: listings.length,
    profile_image: user.profile_image
      ? mapper.mapImageToUrl(user.profile_image)
      : null,
    phone_number: user.phone_number,
  });
});

router.get("/adresss", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.status(200).send(user.address);
});
router.get("/payemtMethods", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.status(200).send(user.paymentMethods);
});

router.post(
  "/addAdresss",
  [auth, validateWith(addressSchema)],
  async (req, res) => {
    const address = await shippingAddress.findOne({
      card_number: req.body.street,
    });
    if (address) {
      return res.status(400).send("Already exists.");
    }
    const new_address = await shippingAddress.create(req.body);
    const user = await User.findById(req.user.userId);
    user.address.push(new_address);
    await user.save();
    res.status(201).send("Shipping Address added added.");
  }
);
router.post(
  "/addPayemtMethods",
  [auth, validateWith(paymentSchema)],
  async (req, res) => {
    const payment_method = await paymentMethod.findOne({
      card_number: req.body.card_number,
    });
    if (payment_method) {
      return res.status(400).send("Already exists.");
    }
    const new_payment = await paymentMethod.create(req.body);
    const user = await User.findById(req.user.userId);
    user.paymentMethods.push(new_payment);
    await user.save();
    res.status(201).send("Payment method added.");
  }
);

module.exports = router;
