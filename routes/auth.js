const express = require("express");
const router = express.Router();
const path = require("path");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const validateWith = require("../middleware/validation");
const { User } = require("../models/users");
const auth = require("../middleware/auth");
const FormData = require("form-data");
const fs = require("fs");
const moment = require("moment");

const date_format = "DD/MM/YYYY";

const schema = {
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
};

router.post("/", validateWith(schema), async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const db_pass = user.password;

  if (!user || password !== db_pass)
    return res.status(400).send({ error: "Invalid email or password." });

  user.last_login = Date.now();
  await user.save();

  const token = jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email,
      profile_image: user.profile_image,
    },
    "jwtPrivateKey"
  );
  res.send(token);
});

router.get("/ProfileImage", auth, async (req, res) => {
  console.log("im here");
  if (!req.user.profile_image)
    return res.status(204).send("the user dos'nt have profile image");
  const imageData = new FormData();
  fs.readFile(
    path.resolve("uploads", req.user.profile_image + ".png"),
    (err, data) => {
      if (!err) imageData.append("image", data);
    }
  );
  res.status(200).send(imageData);
});

router.put("/userLeft", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  let activity = {};
  if (user.activity) activity = user.activity;
  const today = moment().format(date_format);
  if (!(today in activity)) activity[today] = "0";
  const diff = moment().diff(moment(user.last_login), "minute");
  activity[today] = (parseInt(activity[today]) + diff).toString();
  user.activity = activity;
  await user.save();
  res.status(200).send("user activity has been updated.");
});

router.get("/activity", auth, async (req, res) => {
  const ACTIVITY_DAYS = 7;
  const user = await User.findById(req.user.userId);
  const activities = [];
  const user_activity = user.activity.toJSON();
  for (let i = 1; i <= ACTIVITY_DAYS; i++) activities.push(0);
  for (let day in user_activity) {
    const index = moment().diff(moment(day, date_format), "days");
    if (index < ACTIVITY_DAYS) activities[index] = parseInt(user_activity[day]);
  }
  res.status(200).send(activities);
});
module.exports = router;
