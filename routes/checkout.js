const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { User } = require("../models/users");
const mongoose = require("mongoose");
const validateWith = require("../middleware/validation");
const {
  addressSchema,
  shippingAddress,
  deleteAddressSchema,
} = require("../models/shippingAddress");
const {
  paymentSchema,
  paymentMethod,
  deleteSchema,
} = require("../models/paymentMethod");
const CryptoJS = require("crypto-js");
const { Country } = require("../models/address/countries");
const { City } = require("../models/address/cities");

router.post(
  "/addAdresss",
  [auth, validateWith(addressSchema)],
  async (req, res) => {
    const address = await shippingAddress.findOne({
      street: req.body.street, //chnage this
    });
    if (address) return res.status(400).send("Already exists.");
    const country = await Country.findOne({ name: req.body.country });
    if (!country) return res.status(404).send("No such country");
    const new_address = await shippingAddress.create(req.body);
    const user = await User.findById(req.user.userId);
    user.address.push(new_address);
    await user.save();
    res.status(201).send("Shipping Address added added.");
  }
);
//update array after delete
const updateUserAfterDelete = async (req, assetId, assetsName) => {
  const user = await User.findById(req.user.userId);
  const index = user.indexOf(mongoose.Types.ObjectId(assetId));
  if (index == -1) return;
  user[assetsName] = user[assetsName].splice(index, 1);
  await user.save();
};

router.put(
  "/deleteAddress",
  [auth, validateWith(deleteAddressSchema)],
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.body.addressId))
      return res.status(400).send("Invalid id");
    const address = await shippingAddress.findByIdAndRemove(req.body.addressId);
    if (!address) return res.status(404).send("No Such Address...");
    await updateUserAfterDelete(req, address._id, "address");
    res.status(200).send("Deleted");
  }
);
const secretkey = "Pass555";
const encrypt = (messageToencrypt) => {
  var encryptedMessage = CryptoJS.AES.encrypt(messageToencrypt, secretkey);
  return encryptedMessage.toString();
};
const decrypt = (encryptedMessage) => {
  var decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretkey);
  var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);

  return decryptedMessage;
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
    if (payment) {
      const decrypted = {
        payemntId,
        icon: payment.icon,
      };
      ["card_number", "cvv", "expireMonth", "expireYear"].forEach((key) => {
        decrypted[key] = decrypt(payment[key]);
      });

      console.log(decrypted);
      payments_data.push(decrypted);
    }
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
    user.paymentMethods = user.paymentMethods.splice(index, 1);
    await user.save();
    res.status(200).send("Deleted");
  }
);

module.exports = router;
