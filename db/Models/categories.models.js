const db = require('../connection');

exports.fetchAllCategories = () => {
    return db.query(`SELECT * FROM categories;`)
    .then((data)=> {
        return data.rows
    })
}

exports.checkCategoryExits = (name) => {
    if(name){
    return db.query(`SELECT * FROM categories WHERE slug = $1;`,[name])
    .then((result)=>{
        if (result.rowCount === 0){
            return Promise.reject({
                status: 404,
                msg: `Category ${name} does not exist`
            })
        }
    })}
}