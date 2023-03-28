const db = require('../connection')

exports.fetchCommentsByReview = (ID) =>{
    return db.query(`SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,[ID])
    .then(({rows})=>{
        if (rows.length === 0){
            return Promise.reject({status : 404, msg:`No comment found for review ID ${ID}`})
        }
        return rows 
    })
}
