const express = require("express");
const router = express.Router();
const validateWith = require("../middleware/validation");
const multer = require("multer");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const password_generator = require("generate-password");
const fs = require("fs");

const {
  schema,
  User,
  change_pass_schema,
  edit_profile_schema,
  change_subscription_schema,
  forgot_password_schema,
} = require("../models/users");

const {
  sendValidationCodeToEmail,
  sendNewPassword,
} = require("../utilities/mailer");
const config = require("config");
const imageResize = require("../middleware/imageResize");
const { mapImageToUrl } = require("../utilities/mapper");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
});
const upload = multer({ storage, limits: { fieldSize: 25 * 1024 * 1024 } });

router.post(
  "/",
  [
    upload.single("profile_image"),
    validateWith(schema),
    imageResize.resize_profile_image,
  ],
  async (req, res) => {
    const { name, email, password, phone_number } = req.body;
    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .send({ error: "A user with the given email already exists." });
    const hashed_pass = await bcrypt.hash(password, config.get("salt_rounds"));
    user = { name, email, password: hashed_pass, phone_number };
    user.profile_image = req.file ? req.file.filename : null;
    try {
      user = await User.create(user);
      sendValidationCodeToEmail(email, user);
      res.status(201).send("the user was succfully added.");
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .send({ error: "error while saving the user to db." });
    }
  }
);

router.put(
  "/forgot_password",
  validateWith(forgot_password_schema),
  async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).send("the user with the given email not exists");
    if (!user.is_email_verified)
      return res.status(401).send("email not verified");
    const new_password = password_generator.generate({
      length: 8,
      numbers: true,
    });
    const hashed_pass = await bcrypt.hash(
      new_password,
      config.get("salt_rounds")
    );
    user.password = hashed_pass;
    await user.save();
    sendNewPassword(new_password, user.email);
    res.status(200).send("A new password was sent to your email.");
  }
);
router.put(
  "/change_password",
  [auth, validateWith(change_pass_schema)],
  async (req, res) => {
    const user = await User.findById(req.user.userId);
    const curr_pass_match = await bcrypt.compare(
      req.body.curr_password,
      user.password
    );
    if (!curr_pass_match)
      return res.status(400).send("current password is invalid");
    else if (req.body.curr_password === req.body.new_password)
      return res
        .status(400)
        .send("the new password is the same as the previos");
    user.password = await bcrypt.hash(
      req.body.new_password,
      config.get("salt_rounds")
    );
    await user.save();
    res.status(200).send("password was changed succfully");
  }
);

//delete this when done with debug
router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.put(
  "/edit_profile",
  [
    auth,
    upload.single("profile_image"),
    validateWith(edit_profile_schema),
    imageResize.resize_profile_image,
  ],
  async (req, res) => {
    const user = await User.findById(req.user.userId);
    const fields = ["name", "bio", "gender", "phone_number"];
    fields.forEach((field) => {
      if (req.body[field]) user[field] = req.body[field];
    });
    if (req.file) {
      if (user.profile_image) {
        Object.values(mapImageToUrl(user.profile_image)).forEach((file) =>
          fs.unlink(file, (err) => console.log(err))
        );
      }
      user.profile_image = req.file.filename;
    }
    await user.save();
    res.status(200).send("user details was updated succfully");
  }
);

router.put(
  "/change_subscription_type",
  [auth, validateWith(change_subscription_schema)],
  async (req, res) => {
    const user = await User.findById(req.user.userId);
    user.subscribe = req.body.subscribe;
    res.status(200).send("subscription was changed succfully");
  }
);
module.exports = router;
