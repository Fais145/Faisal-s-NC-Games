const { fetchApiInstructions } = require("../Models/api.models")

exports.getApiInstructions = (req,res,next) => {
    res.status(200).send(fetchApiInstructions())
} 