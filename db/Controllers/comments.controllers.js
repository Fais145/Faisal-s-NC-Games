const { fetchCommentsByReview } = require("../Models/comments.models")

exports.getCommentsForReview = (req,res,next) => {
    const {reviewID} = req.params 
    fetchCommentsByReview(reviewID).then((comments)=>{
        res.status(200).send({comments})
    }).catch((err)=>{
        next(err)
    })
}