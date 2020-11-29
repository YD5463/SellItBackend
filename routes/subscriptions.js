const express = require("express");
const router = express.Router();
const { Subscription } = require("../models/subscriptions");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const subscription = await Subscription.find({});
  res.status(200).send(subscription);
});

module.exports = router;
