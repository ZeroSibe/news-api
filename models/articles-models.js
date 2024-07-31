const db = require("../db/connection");

exports.selectArticles = () => {
  const sqlQuery = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.article_id)::INT AS comment_count 
  FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`;
  return db.query(sqlQuery).then(({ rows: articles }) => {
    return articles;
  });
};

exports.selectArticleById = (articleId) => {
  if (isNaN(Number(articleId))) {
    return Promise.reject({ status: 400, msg: "Invalid Article ID" });
  }

  const sqlQuery = `SELECT * FROM articles WHERE article_id = $1;`;
  const queryVals = [articleId];

  return db.query(sqlQuery, queryVals).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `Article ${articleId} Not Found`,
      });
    }

    return rows[0];
  });
};

exports.updateArticle = (articleId, newVote) => {
  if (isNaN(Number(articleId))) {
    return Promise.reject({ status: 400, msg: "Invalid Article ID" });
  }
  if (isNaN(Number(newVote))) {
    return Promise.reject({ status: 400, msg: "inc_votes must be a number" });
  }

  const queryVals = [newVote, articleId];
  const queryStr = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`;
  return db.query(queryStr, queryVals).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `Article ${articleId} Not Found`,
      });
    }
    return rows[0];
  });
};
