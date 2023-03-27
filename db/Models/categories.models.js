const db = require('../connection');

exports.fetchAllCategories = () => {
    return db.query(`SELECT * FROM categories;`)
    .then((data)=> {
        return data.rows
    })
}