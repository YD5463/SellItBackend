const listings = [
  {
    title: "Red jacket",
    images: ["jacket1"],
    price: 100,
    categoryId: "5f554af255d2b30dd816e279",
    userId: "5f554ccf8c0f2c09640ca6ad",
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    title: "Gray couch in a great condition",
    images: ["couch2"],
    categoryId: "5f554af255d2b30dd816e275",
    price: 1200,
    userId: "5f554ccf8c0f2c09640ca6ad",
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    title: "Room & Board couch (great condition) - delivery included",
    description:
      "I'm selling my furniture at a discount price. Pick up at Venice. DM me asap.",
    images: ["couch1", "couch2", "couch3"],
    price: 1000,
    categoryId: "5f554af255d2b30dd816e275",
    userId: "5f554ccf8c0f2c09640ca6ad",
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    title: "Designer wear shoes",
    images: ["shoes1"],
    categoryId: "5f554af255d2b30dd816e279",
    price: 100,
    userId: "5f554ccf8c0f2c09640ca6ad",
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    title: "Canon 400D (Great Condition)",
    images: ["camera1"],
    price: 300,
    categoryId: "5f554af255d2b30dd816e277",
    userId: "5f554ccf8c0f2c09640ca6ad",
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    title: "Nikon D850 for sale",
    images: ["camera2"],
    price: 350,
    categoryId: "5f554af255d2b30dd816e277",
    userId: "5f554ccf8c0f2c09640ca6ad",
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    title: "Sectional couch - Delivery available",
    description: "No rips no stains no odors",
    images: ["couch3"],
    categoryId: "5f554af255d2b30dd816e275",
    price: 950,
    userId: "5f554ccf8c0f2c09640ca6ad",
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    title: "Brown leather shoes",
    images: ["shoes2"],
    categoryId: "5f554af255d2b30dd816e279",
    price: 50,
    userId: "5f554ccf8c0f2c09640ca6ad",
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
];
const categories = [
  {
    name: "Furniture",
    icon: "floor-lamp",
    backgroundColor: "#fc5c65",
    color: "white",
  },
  {
    name: "Cars",
    icon: "car",
    backgroundColor: "#fd9644",
    color: "white",
  },
  {
    name: "Cameras",
    icon: "camera",
    backgroundColor: "#fed330",
    color: "white",
  },
  {
    name: "Games",
    icon: "cards",
    backgroundColor: "#26de81",
    color: "white",
  },
  {
    name: "Clothing",
    icon: "shoe-heel",
    backgroundColor: "#2bcbba",
    color: "white",
  },
  {
    name: "Sports",
    icon: "basketball",
    backgroundColor: "#45aaf2",
    color: "white",
  },
  {
    name: "Movies & Music",
    icon: "headphones",
    backgroundColor: "#4b7bec",
    color: "white",
  },
  {
    name: "Books",
    icon: "book-open-variant",
    backgroundColor: "#a55eea",
    color: "white",
  },
  {
    name: "Other",
    icon: "application",
    backgroundColor: "#778ca3",
    color: "white",
  },
];

const users = [
  {
    email: "test@domain.com",
    name: "Test Man",
    password: "Password1234",
  },
];
const messages = [
  {
    fromUserId: "5f5390378077650abc9c91ba",
    toUserId: "5f5390598077650abc9c91bb",
    listingId: "5f554d41e8291d4584cbbe65",
    content: "Is this still available?",
    dateTime: 1586044521956,
  },
  {
    fromUserId: "5f5390378077650abc9c91ba",
    toUserId: "5f5390598077650abc9c91bb",
    listingId: "5f554d41e8291d4584cbbe65",
    content: "I'm interested in this item. Do you provide free delivery?",
    dateTime: 1586044521956,
  },
  {
    fromUserId: "5f5390378077650abc9c91ba",
    toUserId: "5f5390598077650abc9c91bb",
    listingId: "5f554d41e8291d4584cbbe65",
    content: "Please give me a call and we'll arrange this for you.",
    dateTime: 1586044521956,
  },
];

const subscriptions = [
  {
    name: "Markenting products",
    description:
      "A new product that uploaded last time the much to you - based on AI,\
    Also a new sales notifications",
    platform: "email",
    icon: "cart",
  },
  {
    name: "Transcation confimations",
    description: "A message if transaction like buy or upload product succedd",
    platform: "email",
    icon: "arrow-swap",
  },
];
const mongoose = require("mongoose");
const { Categories } = require("./models/categories");
const { Listings } = require("./models/listings");
const { Message } = require("./models/messages");
const { User } = require("./models/users");
const { Subscription } = require("./models/subscriptions");
const c = require("config");
const seed = async () => {
  // await Categories.insertMany(categories);
  // await User.insertMany(users);
  // await Message.insertMany(messages);
  await Subscription.insertMany(subscriptions);
};

// seed();
const main = async () => {
  await mongoose.connect("mongodb://localhost:27017/SellIt", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("connected to db...");
  // await Listings.insertMany(listings);
  //   await Message.insertMany(messages);
  await Subscription.insertMany(subscriptions);
  await mongoose.disconnect();
  console.log("done");
};

main();
