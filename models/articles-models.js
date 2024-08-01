const db = require("../db/connection");

exports.selectArticles = (sortBy = "created_at", order = "desc", topic) => {
  const validSortBys = [
    "created_at",
    "votes",
    "title",
    "topic",
    "author",
    "comment_count",
  ];

  if (!validSortBys.includes(sortBy)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid sort by query",
    });
  }

  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid order query",
    });
  }
  if (!isNaN(topic)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid topic query",
    });
  }
  let queryVals = [];

  let sqlQuery = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.article_id)::INT AS comment_count 
  FROM articles 
  LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (topic) {
    queryVals.push(topic);
    sqlQuery += ` WHERE articles.topic = $1`;
  }

  sqlQuery += ` GROUP BY articles.article_id 
  ORDER BY ${sortBy} ${order};`;

  return db.query(sqlQuery, queryVals).then(({ rows: articles }) => {
    if (articles.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "No Articles Found",
      });
    }
    return articles;
  });
};

exports.selectArticleById = (articleId) => {
  if (isNaN(Number(articleId))) {
    return Promise.reject({ status: 400, msg: "Invalid Article ID" });
  }

  let sqlQuery = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.article_id)::INT AS comment_count 
  FROM articles 
  LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`;

  let queryVals = [articleId];

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
