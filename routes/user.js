const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { User } = require("../models/users");
const { Listings } = require("../models/listings");
const mongoose = require("mongoose");
const mapper = require("../utilities/mapper");

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.status(200).send({
    userId: user._id,
    email: user.email,
    name: user.name,
    bio: user.bio,
    phone_number: user.phone_number,
    gender: user.gender,
    profile_image: user.profile_image
      ? mapper.mapImageToUrl(user.profile_image)
      : null,
  });
});

router.get("/adresss", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.status(200).send(user.address);
});

router.get("/:id", auth, async (req, res) => {
  const userId = req.params.id;
  if (!mongoose.isValidObjectId(userId))
    return res.status(400).send("invalid user id!");
  const user = await User.findById(userId);
  if (!user) return res.status(404).send("user not exists");

  const listings = await Listings.find({ userId });
  res.status(200).send({
    id: user._id,
    name: user.name,
    email: user.email,
    listings: listings.length,
    profile_image: user.profile_image
      ? mapper.mapImageToUrl(user.profile_image)
      : null,
    phone_number: user.phone_number,
  });
});
module.exports = router;
