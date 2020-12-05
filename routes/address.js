const express = require("express");
const router = express.Router();
const { Country } = require("../models/address/countries");
const { City } = require("../models/address/cities");
const { State } = require("../models/address/states");

router.get("/countries", async (req, res) => {
  const countries = await Country.find();
  res.send(countries);
});

router.get("/cities", async (req, res) => {
  const cities = await City.find();
  res.send(cities);
});

router.get("/states", async (req, res) => {
  const states = await State.find();
  res.send(states);
});

module.exports = router;
