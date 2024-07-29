const { getEndpoints } = require("../controllers/api-controllers");
const articlesRouter = require("./articles-router");
const topicsRouter = require("./topics-router");

const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
