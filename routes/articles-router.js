const {
  getArticleById,
  getArticles,
} = require("../controllers/articles-controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles);

articlesRouter.route("/:article_id").get(getArticleById);

module.exports = articlesRouter;
