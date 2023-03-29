const express = require('express')
const { getAllCategories } = require('./Controllers/categories.controllers');
const { getCommentsForReview } = require('./Controllers/comments.controllers');
const { handleCustomErrors, handlePSQLErrors, handleServerErrors } = require('./Controllers/errors.controllers');
const { getAReview, getAllReviews, patchAReview } = require('./Controllers/reviews.controllers');

const app = express();
app.use(express.json());

app.get('/api/categories',getAllCategories)
app.get('/api/reviews', getAllReviews)
app.get('/api/reviews/:reviewID',getAReview)
app.patch('/api/reviews/:reviewID',patchAReview )

app.get('/api/reviews/:reviewID/comments',getCommentsForReview)

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);

//handles error typos 
app.all("*", (req, res) => {
    res.status(404).send({ msg: "Invalid file path!" });
  });

module.exports = {app};