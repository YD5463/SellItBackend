const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { User } = require("../models/users");
const { Message } = require("../models/messages");
const { mapImageToUrl } = require("../utilities/mapper");

router.get("/", auth, async (req, res) => {
  let chats = {};
  const userId = req.user.userId;
  const messages = await Message.find({
    $or: [{ fromUserId: userId }, { toUserId: userId }],
  }).sort({ dateTime: -1 });
  for (let message of messages) {
    const id =
      message.fromUserId === userId ? message.toUserId : message.fromUserId;
    chats[id] = { content: message.content, contentType: message.contentType };
  }
  const contacts = await User.find({ _id: { $in: Object.keys(chats) } });
  const fullChatsData = [];
  for (let i = 0; i < contacts.length; i++) {
    fullChatsData.push({
      contactProfileImage: contacts[i].profile_image
        ? mapImageToUrl(contacts[i].profile_image)
        : null,
      contactName: contacts[i].name,
      contactId: contacts[i]._id,
      lastMessage: chats[contacts[i]._id],
    });
  }

  res.status(200).send(fullChatsData);
});

module.exports = router;
