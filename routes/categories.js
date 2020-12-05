const express = require("express");
const router = express.Router();
const { Categories } = require("../models/products/categories");

router.get("/", async (req, res) => {
  const categories = await Categories.find();
  res.send(categories);
});

module.exports = router;
