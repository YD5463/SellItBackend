const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { Categories } = require("../models/products/categories");
const path = require("path");

router.get("/:filename/", auth, (req, res) => {
  const filename = req.params.filename;
  console.log(filename);
  console.log(path.resolve(`./public/assets/${filename}`));
  res
    .status(200)
    .sendFile(path.resolve(`./public/assets/${filename}`), (err) => {});
});
module.exports = router;
