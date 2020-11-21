const { networkInterfaces } = require("os");
const config = require("config");
const nets = networkInterfaces();
const results = Object.create(null); // or just '{}', an empty object

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
    if (net.family === "IPv4" && !net.internal) {
      if (!results[name]) {
        results[name] = [];
      }

      results[name].push(net.address);
    }
  }
}
const port = process.env.PORT || config.get("port");
module.exports.url = `http://${results["WiFi"][0]}:${port}/assets/`;
