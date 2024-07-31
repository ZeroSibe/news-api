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

exports.insertCommentByArticleId = (articleId, username, body) => {
  if (isNaN(Number(articleId))) {
    return Promise.reject({
      status: 400,
      msg: "Invalid Article ID",
    });
  }

  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Missing required field in comment post",
    });
  }

  const queryVals = [body, username, articleId];
  const sqlQuery = `INSERT INTO comments 
  (body, author, article_id, votes) 
  VALUES ($1, $2, $3, 0) 
  RETURNING *;`;
  return db.query(sqlQuery, queryVals).then(({ rows }) => {
    return rows[0];
  });
};
