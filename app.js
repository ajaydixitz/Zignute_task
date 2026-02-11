require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const port = process.env.PORT || 6000;
const mongoose = require("mongoose");
const db_url = process.env.DB_URL;
const app = express();
const http = require("http");
const server = http.createServer(app);
const {
  responseStatus,
  checkIpList,
  msgConstant,
} = require("./helpers/appConstants");
const utils = require("./helpers/utils");
const { dbInitializer } = require("./helpers/db.setup");
const v1Routes = require("./routes/v1/index.route");
const { requestDecryptor } = require("./helpers/decryptor");
const { ipLimiter } = require("./helpers/setLimitter");

// App middlewares

app.use((req, res, next) => {
  const clientIp = req.ip;
  if (
    checkIpList.whiteListIps.includes(clientIp) ||
    req.originalUrl.split("/")[3] == "admin"
  )
    return next();

  if (checkIpList.blackListIps.includes(clientIp))
    return res
      .status(responseStatus.forbidden)
      .json(utils.createErrorResponse(req, msgConstant.accessDenied));

  return ipLimiter(req, res, next);
});

//app.use(ipLimiter);
app.use(cors());
app.use(logger("dev"));
app.use("/public", express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

app.use(requestDecryptor);
app.use("/api/v1", v1Routes);

// Error handling
app.use((err, req, res, next) =>
  res
    .status(responseStatus.internalServerError)
    .json(utils.createErrorResponse(req, err.message)),
);
app.use((req, res) =>
  res.status(responseStatus.notFound).send("server is running"),
);

mongoose
  .connect(db_url)
  .then(() => {
    console.log("===========Database connected===========", db_url);
    server.listen(
      port,
      console.log(`Your server is running on port---- ${port}`),
    );
    //for static database document creation
    dbInitializer();

    //for static folder creation
    utils.createStaticFolders();
  })
  .catch((err) => {
    console.log("Database connection error", err);
    process.exit();
  });
