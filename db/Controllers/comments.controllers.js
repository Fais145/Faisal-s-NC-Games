const { fetchCommentsByReview, fetchCommentForPost, deletingComment, checkCommentExists } = require("../Models/comments.models");
const { checkReviewExists } = require("../Models/reviews.models");


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

exports.deleteComment = (req, res, next) => {
  const {commentID} = req.params

  const commentPromises = [deletingComment(commentID),checkCommentExists(commentID)];

  Promise.all(commentPromises).then(()=>{
    res.status(204).send()
  }).catch((err)=>{
    next(err)
  }) 
}