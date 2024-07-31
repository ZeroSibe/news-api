const db = require("../db/connection");

exports.selectUserByUsername = (username) => {
  if (!isNaN(Number(username)) || !username) {
    return Promise.reject({
      status: 400,
      msg: "Invalid username",
    });
  }
  const queryVals = [username];
  const queryStr = `SELECT users.username, users.name, users.avatar_url FROM users WHERE username = $1;`;
  return db.query(queryStr, queryVals).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `User ${username} Not Found`,
      });
    }
    return rows[0];
  });
};
