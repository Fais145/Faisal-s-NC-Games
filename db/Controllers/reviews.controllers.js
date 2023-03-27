const { fetchAllReviews } = require("../Models/reviews.models")

exports.getAllReviews = (req,res, next) => {
    const {reviewID} = req.params
    fetchAllReviews(reviewID).then((reviews)=>{
        res.status(200).send({reviews})
    })
    .catch((err)=>{
        next(err)
    })
}