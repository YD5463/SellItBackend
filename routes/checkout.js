const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { User } = require("../models/users");
const mongoose = require("mongoose");
const validateWith = require("../middleware/validation");
const { addressSchema, shippingAddress } = require("../models/shippingAddress");
const {
  paymentSchema,
  paymentMethod,
  deleteSchema,
} = require("../models/paymentMethod");
const CryptoJS = require("crypto-js");

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

const getKeyAndIv = () => {
  const key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
  const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
  return { key, iv };
};

const encrypt = (text) => {
  const { key, iv } = getKeyAndIv();
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    padding: CryptoJS.pad.NoPadding,
  });
  return encrypted.toString();
};

const decrypt = (text) => {
  const { key, iv } = getKeyAndIv();
  const decrypted = CryptoJS.AES.decrypt(text, key, {
    iv: iv,
    padding: CryptoJS.pad.NoPadding,
  });
  return decrypted.toString();
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
      encrypted[key] = encrypt(value);
    }
    const new_payment = await paymentMethod.create(encrypted);
    const user = await User.findById(req.user.userId);
    user.paymentMethods.push(new_payment);
    await user.save();
    res.status(201).send("Payment method added.");
  }
);

router.get("/paymentMethods", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  const payments_data = [];
  const decrypPromises = user.paymentMethods.map(async (payemntId) => {
    const payment = await paymentMethod.findById(payemntId);
    // console.log(payment);
    const decrypted = { payemntId };
    ["card_number", "cvv", "expireMonth", "expireYear"].forEach((key) => {
      decrypted[key] = decrypt(payment[key]);
    });
    payments_data.push(decrypted);
  });
  await Promise.all([...decrypPromises]);
  res.status(200).send(payments_data);
});

router.put(
  "/deletePaymentMethod",
  [auth, validateWith(deleteSchema)],
  async (req, res) => {
    const user = await User.findById(req.user.userId);
    const payment = await paymentMethod.findByIdAndRemove(req.body.paymentId);
    if (!payment) return res.status(404).send("No such payment method");

    const index = user.paymentMethods.indexOf(
      mongoose.Types.ObjectId(payment._id)
    );
    if (index == -1) return res.status(404).send("not found");
    console.log(index);
    user.paymentMethods.splice(index, 1);
    await user.save();
    res.status(200).send("Deleted");
  }
);

module.exports = router;
