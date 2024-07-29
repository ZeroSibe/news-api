const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const { handleServerErrors } = require("./controllers/errors-controllers");

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path Not Found" });
});

app.use(handleServerErrors);

module.exports = app;
