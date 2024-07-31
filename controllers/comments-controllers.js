const { selectArticleById } = require("../models/articles-models");
const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
} = require("../models/comments-models");
const { selectUserByUsername } = require("../models/users-models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    selectCommentsByArticleId(article_id),
    selectArticleById(article_id),
  ])
    .then(([comments, __article]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  Promise.all([selectArticleById(article_id), selectUserByUsername(username)])
    .then(() => {
      return insertCommentByArticleId(article_id, username, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
