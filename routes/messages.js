const express = require("express");
const router = express.Router();
const { Expo } = require("expo-server-sdk");
const sendPushNotification = require("../utilities/pushNotifications");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");
const { User } = require("../models/users");
const { schema, Message } = require("../models/messages");
const { io } = require("../index");
const config = require("config");
const Joi = require("joi");

router.get("/:contactId", auth, async (req, res) => {
  const userId = req.user.userId;
  const contactId = req.params.contactId;
  const messges = await Message.find({
    $or: [
      { fromUserId: contactId, toUserId: userId },
      { fromUserId: userId, toUserId: contactId },
    ],
  }).sort({ dateTime: -1 });
  res.status(200).send(messges);
});
module.exports = router;
