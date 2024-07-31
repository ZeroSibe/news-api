const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const {
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors-controllers");

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path Not Found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
