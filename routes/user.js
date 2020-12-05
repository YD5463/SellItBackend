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
const CryptoJS = require("crypto-js");

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
const encrypt = (text) => {
  var key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
  var iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

  var encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    padding: CryptoJS.pad.NoPadding,
  });

  return encrypted.toString();
};

router.post(
  "/addPayemtMethods",
  [auth, validateWith(paymentSchema)],
  async (req, res) => {
    const encrypted_card_number = encrypt(req.body.card_number);

    const payment_method = await paymentMethod.findOne({
      card_number: encrypted_card_number,
    });
    if (payment_method) {
      return res.status(400).send("Already exists.");
    }
    const encrypted = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (!value) continue;
      encrypted[key] = encrypt(req.body.card_number);
    }
    console.log(encrypted);
    const new_payment = await paymentMethod.create(encrypted);
    const user = await User.findById(req.user.userId);
    user.paymentMethods.push(new_payment);
    await user.save();
    res.status(201).send("Payment method added.");
  }
);

module.exports = router;
