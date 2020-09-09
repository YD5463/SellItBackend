const express = require("express");
const router = express.Router();
const validateWith = require("../middleware/validation");
const { schema, User } = require("../models/users");
const multer = require("multer");

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
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .send({ error: "A user with the given email already exists." });
    user = { name, email, password };
    user.profile_image = req.file.filename;

    try {
      user = await User.create(user);
      res.status(201).send(user);
    } catch (e) {
      return res
        .status(500)
        .send({ error: "error while saving the user to db." });
    }
  }
);

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

module.exports = router;
