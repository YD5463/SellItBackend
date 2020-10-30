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
const bcrypt = require("bcrypt");
const { sendValidationCodeToEmail } = require("../utilities/mailer");
const date_format = "DD/MM/YYYY";

const schema = {
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
};
const generate_token = (user) => {
  const token = jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      profile_image: user.profile_image,
    },
    "jwtPrivateKey"
  );
  return token;
};
router.get("/send_velidation_code", auth, (req, res) => {
  sendValidationCodeToEmail(req.user.email, req.user);
  res.status(200).send("code sent");
});

const code_schema = { code: Joi.string().required() };
router.post("/validate_email", validateWith(code_schema), async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("user not exists");
  if (user.is_email_verified)
    return res.status(200).send("email already verified!");
  const diff = Date.now() - user.verify_code_time;
  if (req.body.code === user.verify_code && (diff / (60 * 1000)) % 60 < 10) {
    user.is_email_verified = true;
    await user.save();
    return res.status(200).send(generate_token(user));
  }
  res.status(400).send("code is expired or worng!");
});
router.post("/", validateWith(schema), async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).send({ error: "Invalid email or password." });

  const password_match = await bcrypt.compare(password, user.password);
  if (!password_match)
    return res.status(400).send({ error: "Invalid email or password." });
  user.last_login = Date.now();
  await user.save();
  if (user.is_email_verified) return res.status(200).send(generate_token(user));
  sendValidationCodeToEmail(email, user);
  res.send("user created, please validate your email to get the token");
});

router.get("/ProfileImage", auth, async (req, res) => {
  console.log("im here");
  if (!req.user.profile_image)
    return res.status(204).send("the user dos'nt have profile image");
  const imageData = new FormData();
  fs.readFile(
    path.resolve("uploads", "afe1a88696e5bad276631fe8f61fef8d.png"), //req.user.profile_image + ".png"),
    (err, data) => {
      if (!err) imageData.append("image", data);
      if (err) console.log("error sending", err);
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
