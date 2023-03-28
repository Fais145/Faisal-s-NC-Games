const { fetchCommentsByReview, checkReviewExists } = require("../Models/comments.models");

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
