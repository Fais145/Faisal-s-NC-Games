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

//this function is for get requests where a comment COULD be out there but the endpoint is giving []
exports.checkCommentExists = (ID) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [ID])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
            status: 404,
            msg: `Comment ID ${ID} does not exist`,
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

exports.deletingComment = (ID) => {
    return db.query( `DELETE FROM comments WHERE comment_id = $1;`,[ID]).then(()=>{})
}
