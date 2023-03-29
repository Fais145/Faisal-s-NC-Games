const db = require("../connection");

exports.fetchCommentsByReview = (ID) => {
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
      [ID]
    )
    .then(({ rows }) => {
      return rows 
    });
};

//this function is for get requests where a review COULD be out there but the endpoint is giving []
exports.checkReviewExists = (ID) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [ID])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
            status: 404,
            msg: `review ID ${ID} does not exist`,
          });
      }
    });
};

exports.fetchCommentForPost = (ID, commentObj) => {
const paramArray = [commentObj.username, commentObj.body, ID]

return db.query(`INSERT INTO comments (author, body, review_id) VALUES ($1,$2,$3) RETURNING*;`,paramArray).then(({rows})=>{
  return rows 
})
}
