const { checkCategoryExits } = require("../Models/categories.models");
const {
  fetchAllReviews,
  updatingAReview,
  updateReview,
} = require("../Models/reviews.models");
const { fetchAReview } = require("../Models/reviews.models");


exports.getAllReviews = (req, res, next) => {
  const {category} = req.query;
  const reviewPromises = [fetchAllReviews(category),checkCategoryExits(category)] 

  Promise.all(reviewPromises).then(([reviews]) => {
    res.status(200).send({ reviews });
  }).catch((err)=>{
    next(err)
  })
};

exports.getAReview = (req, res, next) => {
  const { reviewID } = req.params;
  fetchAReview(reviewID)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchAReview = (req, res, next) => {
  const { reviewID } = req.params;
  const newVotes = req.body.inc_votes;
  updateReview(reviewID, newVotes)
    .then(([review]) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
