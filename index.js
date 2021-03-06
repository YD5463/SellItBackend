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
const assets = require("./routes/assets");
const expoPushTokens = require("./routes/expoPushTokens");
const address = require("./routes/address");
const checkout = require("./routes/checkout");
const chats = require("./routes/chats");
const helmet = require("helmet");
const compression = require("compression");
const config = require("config");
const mongoose = require("mongoose");
const io = require("socket.io");
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
app.use("/", assets);

const options = {
  key: fs.readFileSync("ssl/key.pem"),
  cert: fs.readFileSync("ssl/cert.pem"),
};
const port = process.env.PORT || config.get("port");
const server = require("http").createServer(app);
const websocket = io(server);

server.listen(port, () => console.log("server running on port:" + port));
//----------------------------------------
const jwt = require("jsonwebtoken");
const { Message } = require("./models/messages");

websocket.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return;
  try {
    const payload = jwt.verify(token, config.get("jwtKey"));
    socket.user = payload;
    next();
  } catch (err) {}
});
websocket.on("connection", async (socket) => {
  const userId = socket.user.userId;
  // console.log("a user connected", userId);
  const usersChats = await chats.getChatsByUserId(userId);
  socket.join(userId);
  websocket.to(userId).emit("ExistingMessages", usersChats);
  socket.on("send message", async (message, callback) => {
    try {
      delete message.isSent;
      await Message.create(message);
      console.log(message);
      websocket.to(message.toUserId).emit("receive message", message);
      callback("ok");
    } catch (err) {
      console.log("Worng foamt", err);
    }
  });
  socket.on("send file", (message, callback) => {
    fs.writeFile(
      "./public/assets/record.mp4",
      message.file,
      "base64",
      async (err) => {
        if (!err) return;
        delete message.file;
        delete message.isSent;
        message.content = "record.mp4";
        await Message.create(message);
      }
    );
  });
});
//------------------------------------------------------------------------

module.exports.websocket = websocket;
