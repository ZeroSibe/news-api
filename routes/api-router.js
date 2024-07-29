const topicsRouter = require("./topics-router");

const apiRouter = require("express").Router();

apiRouter.get("/", (req, res) => {
  res.status(200).send("Server is running...");
});

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
