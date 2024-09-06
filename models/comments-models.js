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

exports.deleteCommentById = (commentId) => {
  if (isNaN(commentId)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid Comment ID",
    });
  }
  const queryVals = [commentId];
  const sqlQuery = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`;
  return db.query(sqlQuery, queryVals).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Comment Not Found",
      });
    }
  });
};

exports.updateComment = (commentId, newVote) => {
  if (isNaN(Number(commentId))) {
    return Promise.reject({ status: 400, msg: "Invalid Comment ID" });
  }
  if (isNaN(Number(newVote))) {
    return Promise.reject({
      status: 400,
      msg: "bad request to comment: inc_votes must be a number",
    });
  }

  const queryVals = [newVote, commentId];
  const queryStr = `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`;
  return db.query(queryStr, queryVals).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `Comment ${commentId} Not Found`,
      });
    }
    return rows[0];
  });
};
