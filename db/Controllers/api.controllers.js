const json = require('../../endpoints.json')

exports.getApiInstructions = (req,res,next) => {
    res.status(200).send(json)
} 