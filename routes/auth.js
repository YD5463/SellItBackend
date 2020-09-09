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

module.exports = router;
