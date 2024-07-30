const { selectArticleById } = require("../models/articles-models");
const { selectCommentsByArticleId } = require("../models/comments-models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    selectCommentsByArticleId(article_id),
    selectArticleById(article_id),
  ])
    .then((promisedResult) => {
      res.status(200).send({ comments: promisedResult[0] });
    })
    .catch(next);
};
