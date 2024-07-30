const db = require("../db/connection");

exports.selectCommentsByArticleId = (articleId) => {
  if (isNaN(Number(articleId))) {
    return Promise.reject({
      status: 400,
      msg: "Invalid Article ID",
    });
  }
  const queryVals = [articleId];

  const sqlQuery = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`;
  return db.query(sqlQuery, queryVals).then(({ rows: comments }) => {
    return comments;
  });
};
