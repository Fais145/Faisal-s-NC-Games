const { fetchCommentsByReview, checkReviewExists, fetchCommentForPost } = require("../Models/comments.models");

exports.getCommentsForReview = (req, res, next) => {
  const { reviewID } = req.params;
  
  const commentPromises = [fetchCommentsByReview(reviewID),checkReviewExists(reviewID)]

  Promise.all(commentPromises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};


exports.postCommentForReview = (req, res, next) => {
  const {reviewID} = req.params
  const {body} = req

  fetchCommentForPost(reviewID, body).then(([comment])=>{
    res.status(201).send({comment})
  }).catch((err)=>{
    next(err)
  })
}