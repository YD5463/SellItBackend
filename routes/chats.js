const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { User } = require("../models/users");
const mongoose = require("mongoose");
const validateWith = require("../middleware/validation");

router.get("/", auth, async (req, res) => {
  const chats = [
    {
      contactProfileImage:
        "http://192.168.68.110:9000/assets/a60d685194a7fd984d08a595a0a99ae7.jpg",
      contactName: "Alice",
      contactId: "323251",
      lastMessage: { text: "Hey there" },
    },
    {
      contactProfileImage:
        "http://192.168.68.110:9000/assets/profileimage1.jpg",
      contactName: "Bobe",
      contactId: "848499",
      lastMessage: { text: "Bye bye" },
    },
    {
      contactProfileImage:
        "http://192.168.68.110:9000/assets/sgsjhs65s64shdjgddx56623ddknd.jpg",
      contactName: "Herry",
      contactId: "123548",
      lastMessage: { text: "I have to go" },
    },
  ];
  res.status(200).send(chats);
});

module.exports = router;
