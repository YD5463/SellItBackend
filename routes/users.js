const express = require("express");
const router = express.Router();
const validateWith = require("../middleware/validation");
const { schema, User } = require("../models/users");
const multer = require("multer");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const { sendValidationCodeToEmail } = require("../utilities/mailer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
});
const upload = multer({ storage });

router.post(
  "/",
  upload.single("profile_image"),
  validateWith(schema),
  async (req, res) => {
    console.log("im here");
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .send({ error: "A user with the given email already exists." });
    const hashed_pass = await bcrypt.hash(password, 10);
    user = { name, email, password: hashed_pass };
    user.profile_image = req.file ? req.file.filename : null;
    try {
      user = await User.create(user);
      sendValidationCodeToEmail(email,user);
      res.status(201).send(user);
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .send({ error: "error while saving the user to db." });
    }
  }
);

router.put("/change_password", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (user.password !== req.body.curr_password)
    return res.status(400).send("current password is invalid");
  else if (user.password === req.body.new_password)
    return res.status(400).send("the new password is the same as the previos");
  console.log(user);
  user.password = req.body.new_password;
  await user.save();
  res.status(200).send("password was changed succfully");
});

//delete this when done with debug
router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.put("/edit_profile", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  const fields = ["email", "name", "bio", "gender", "phone_number"];
  fields.forEach((field) => {
    if (req.body[field]) user[field] = req.body[field];
  });
  await user.save();
  res.status(200).send("user details was updated succfully");
});

module.exports = router;
