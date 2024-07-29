const db = require("../db/connection");

exports.selectArticles = () => {
  let sqlQuery = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
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
