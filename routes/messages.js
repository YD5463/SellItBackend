const express = require("express");
const router = express.Router();
const { Expo } = require("expo-server-sdk");

const sendPushNotification = require("../utilities/pushNotifications");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");
const { User } = require("../models/users");
const { Listings } = require("../models/listings");
const { schema, Message } = require("../models/messages");

router.get("/", auth, async (req, res) => {
  const messages = Message.find({
    $or: [
      ({
        toUserId: req.user.userId,
      },
      { fromUser: req.user.userId }),
    ],
  });

  const mapUser = async (userId) => {
    const user = await User.findById(userId);
    if (user == null) return { name: "removed user" };
    return { name: user.name };
  };

  const resources = await messages.map(async (message) => ({
    // id: message._id,
    listingId: message.listingId,
    dateTime: message.dateTime,
    content: message.content,
    fromUser: await mapUser(message.fromUserId),
    toUser: await mapUser(message.toUserId),
  }));
  console.log(resources);
  res.send(resources);
});

router.post("/", [auth, validateWith(schema)], async (req, res) => {
  const { listingId, message } = req.body;

  const listing = await Listings.findById(listingId);
  if (!listing) return res.status(400).send({ error: "Invalid listingId." });

  const targetUser = await User.findById(listing.userId);
  if (!targetUser) return res.status(400).send({ error: "Invalid userId." });

  messagesStore.add({
    fromUserId: req.user.userId,
    toUserId: listing.userId,
    listingId,
    content: message,
  });

  const { expoPushToken } = targetUser;

  if (Expo.isExpoPushToken(expoPushToken))
    await sendPushNotification(expoPushToken, message);

  res.status(201).send();
});

module.exports = router;
