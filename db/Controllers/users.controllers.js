const { fetchAllUsers } = require("../Models/users.models")

exports.getAllUsers = (req,res) => {
    fetchAllUsers().then((users)=>{
        res.status(200).send({users})
    })
}