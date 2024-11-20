const {
  selectArticleById,
  selectArticles,
  updateArticle,
  insertArticle,
} = require("../models/articles-models");
const { selectTopicBySlug } = require("../models/topics-models");
const { selectUserByUsername } = require("../models/users-models");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  selectArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  Promise.all([selectUserByUsername(author), selectTopicBySlug(topic)])
    .then(() => {
      return insertArticle({ author, title, body, topic, article_img_url });
    })
    .then((articleId) => selectArticleById(articleId))
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
