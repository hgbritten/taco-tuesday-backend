'use strict';

const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {type: String, required: true},
  ingredients: {type: String, required: true}
})

module.exports = mongoose.model('recipe', recipeSchema)
