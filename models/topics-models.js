const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows: topics }) => {
    return topics;
  });
};

exports.selectTopicBySlug = (slug) => {
  if (!isNaN(Number(slug)) || !slug) {
    return Promise.reject({
      status: 400,
      msg: "Invalid topic name",
    });
  }

  const queryVals = [slug];
  const queryStr = `
  SELECT * FROM topics
  WHERE slug = $1;
  `;
  return db.query(queryStr, queryVals).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `Topic ${slug} Not Found`,
      });
    }
    return rows[0];
  });
};
