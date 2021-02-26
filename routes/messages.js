const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Message } = require("../models/messages");

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
