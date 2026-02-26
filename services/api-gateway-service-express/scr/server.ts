const express = require("express");

const { ROUTES } = require("./routes");

const { setupLogging } = require("./logger/logger");
const { setupRateLimit } = require("./ratelimit/ratelimit");
const { setupProxies } = require("./proxy/proxy");

const app = express();
const port = process.env.API_GATEWAY_PORT || 3020;

setupLogging(app);
setupRateLimit(app, ROUTES);
setupProxies(app, ROUTES);

app.get("/", (_, res) => {
  return res.send("API Gateway is up.");
});

app.listen(port, () => {
  console.log(`API Gateway is running on port:${port}`);
});
