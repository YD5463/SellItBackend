const express = require("express");
const categories = require("./routes/categories");
const listings = require("./routes/listings");
const listing = require("./routes/listing");
const users = require("./routes/users");
const user = require("./routes/user");
const auth = require("./routes/auth");
const subscriptions = require("./routes/subscriptions");
const my = require("./routes/my");
const transactions = require("./routes/transactions");
const messages = require("./routes/messages");
const expoPushTokens = require("./routes/expoPushTokens");
const address = require("./routes/address");
const checkout = require("./routes/checkout");
const helmet = require("helmet");
const compression = require("compression");
const config = require("config");
const mongoose = require("mongoose");
const https = require("https");
const fs = require("fs");
const apicache = require("apicache");
const app = express();
// const limit = require("./startup/limiter");
const db = config.get("db");

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: true,
  })
  .then(() => console.info(`Connected to ${db}...`))
  .catch((reason) => console.log("field to connect mongo db", reason));

const cache = apicache.middleware;
// app.use(cache("5 minutes"));
app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(compression());
// app.use(
//   require("express-session")({
//     secret: "secertKey",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: true,
//       maxAge: 60 * 60 * 1000 * 24 * 365,
//     },
//   })
// );

app.use("/api/categories", categories);
app.use("/api/listing", listing);
app.use("/api/listings", listings);
app.use("/api/user", user);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/my", my);
app.use("/api/expoPushTokens", expoPushTokens);
app.use("/api/messages", messages);
app.use("/api/subscriptions", subscriptions);
app.use("/api/transactions", transactions);
app.use("/api/address/", address);
app.use("/api/checkout/", checkout);

const options = {
  key: fs.readFileSync("ssl/key.pem"),
  cert: fs.readFileSync("ssl/cert.pem"),
};
const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}...`)
);
module.exports = server;
// https
//   .createServer(options, app)
//   .listen(port, () => console.log(`Server started on port ${port}...`));
