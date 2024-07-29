const db = require("../db/connection");

exports.selectArticleById = (articleId) => {
  if (isNaN(Number(articleId))) {
    return Promise.reject({ status: 400, msg: "Invalid Article ID" });
  }

  let sqlQuery = `SELECT * FROM articles WHERE article_id = $1;`;
  let queryVals = [articleId];

  return db.query(sqlQuery, queryVals).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Article Not Found",
      });
    }

    return rows[0];
  });
};
