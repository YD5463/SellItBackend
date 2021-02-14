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

module.exports = router;
