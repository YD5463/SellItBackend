const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { Categories } = require("../models/products/categories");
const path = require("path");

router.get("/profileImage/:full", auth, (req, res) => {
  console.log(req.params.full);
  if (req.params.full === "true")
    res
      .status(200)
      .sendFile(
        "E:\\SomeStaff\\SellItApp\\Backend\\public\\assets\\87aea3015291e3d299438cb0d3a81833_full.jpg"
      );
  else
    res
      .status(200)
      .sendFile(
        `E:\\SomeStaff\\SellItApp\\Backend\\public\\assets\\87aea3015291e3d299438cb0d3a81833_thumb.jpg`
      );
});
module.exports = router;
