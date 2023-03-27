const { fetchAReview } = require("../Models/reviews.models")

exports.getAReview = (req,res, next) => {
    const {reviewID} = req.params
    fetchAReview(reviewID).then((review)=>{
        res.status(200).send({review})
    })
    .catch((err)=>{
        next(err)
    })
}