const mongoose = require("mongoose");
const { Categories } = require("./models/products/categories");
const { Listings } = require("./models/products/listings");
const { Message } = require("./models/messages");
const { User } = require("./models/users");
const { Subscription } = require("./models/subscriptions");
const config = require("config");
const { Country } = require("./models/address/countries");
const { State } = require("./models/address/states");
const { City } = require("./models/address/cities");
const cities = require("./seed_data/world-cities_json.json");
const lookup = require("country-code-lookup");
const { OrderStatus } = require("./models/orderStatus");

const addressSeed = async () => {
  const promises = [];
  for (const cityid in cities) {
    const city_data = cities[cityid];
    let country = await Country.findOne({ name: city_data.country });
    if (!country) {
      const codeName = lookup.byCountry(city_data.country);
      country = await Country.create({
        name: city_data.country,
        codeName: codeName ? codeName.internet : "",
      });
    }
    if (await City.exists({ name: city_data.name })) continue;
    let state = await State.find({ name: city_data.subcountry });
    if (!state)
      state = await State.create({
        name: city_data.subcountry,
        country: city_data.country,
        codeName: "",
      });
    await City.create({
      name: city_data.name,
      country: country._id,
      state: state._id,
    });
  }
  await Promise.all([...promises]);
};
const messagesSeed = async () => {
  const myId = "5f9b00d67b548026684d9848";
  const peerId = "5fac01b832b5c624f40b202a";
  await Message.create({
    fromUserId: myId,
    toUserId: peerId,
    content: "hey there",
    dateTime: Date.now(),
  });
  await Message.create({
    fromUserId: peerId,
    toUserId: myId,
    content: "im good how are you",
    dateTime: Date.now(),
  });
  await Message.create({
    fromUserId: myId,
    toUserId: peerId,
    content: "great",
    dateTime: Date.now(),
  });
};

const orderStatusesSeed = async () => {
  await OrderStatus.create({
    name: "Delivered",
    codeName: "D",
    color: "green",
  });
  await OrderStatus.create({
    name: "Proccessing",
    codeName: "P",
    color: "blue",
  });
  await OrderStatus.create({
    name: "Cancelled",
    codeName: "C",
    color: "red",
  });
};
const main = async () => {
  await mongoose.connect("mongodb://localhost:27017/SellIt", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("connected to db...");
  // await Listings.insertMany(listings);
  //   await Message.insertMany(messages);
  // await Subscription.insertMany(subscriptions);
  // const usa = await Country.findOne({ codeName: "US" });
  // for (let [codeName, name] of Object.entries(states)) {
  //   await State.create({ name, codeName, country: usa._id });
  //
  // await messagesSeed();
  // await orderStatusesSeed();
  await mongoose.disconnect();
  console.log("done");
};

main();
