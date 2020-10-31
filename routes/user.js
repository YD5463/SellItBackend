const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { User } = require("../models/users");
const { Listings } = require("../models/listings");
const mongoose = require("mongoose");
const path = require("path");

router.get("/profileImage/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user.profile_image)
    return res.status(404).send("the user dos'nt have profile image");
  res.sendFile(path.resolve("uploads", user.profile_image));
});

router.get("/:id", auth, async (req, res) => {
  const userId = req.params.id;
  if (!mongoose.isValidObjectId(userId))
    return res.status(400).send("invalid user id!");
  const user = await User.findById(userId);
  if (!user) return res.status(404).send("user not exists");

  const listings = await Listings.find({ userId });
  res.send({
    id: user.id,
    name: user.name,
    email: user.email,
    listings: listings.length,
  });
});

module.exports = router;
