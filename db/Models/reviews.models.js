const db = require('../connection')

exports.fetchAReview = (ID) => {

    return db.query(`SELECT * FROM reviews WHERE review_id = $1;`,[ID]).then((data)=>{
        const review = data.rows[0]
        if(!review){
            return Promise.reject({
                status: 404,
                msg: `No review found for review ID ${ID}`
            })
        }
        return data.rows[0]
    })
}


