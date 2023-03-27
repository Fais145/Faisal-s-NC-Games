const express = require('express')
const { getAllCategories } = require('./Controllers/categories.controllers')

const app = express();

app.get('/api/categories',getAllCategories)


//handles error typos 
app.all("*", (req, res) => {
    res.status(404).send({ msg: "Invalid file path!" });
  });

module.exports = {app};