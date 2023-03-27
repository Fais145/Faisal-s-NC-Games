const { fetchAllCategories } = require("../Models/categories.models")

exports.getAllCategories = (req, res) => {
        fetchAllCategories().then((categories)=>{
            res.status(200).send({categories})
        })
}