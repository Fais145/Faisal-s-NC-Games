const {
  fetchAllReviews,
  updatingAReview,
  updateReview,
} = require("../Models/reviews.models");
const { fetchAReview } = require("../Models/reviews.models");

exports.getAllReviews = (req, res, next) => {
  fetchAllReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
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
