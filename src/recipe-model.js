'use strict';

const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: String, required: true }
})

const userSchema = new mongoose.Schema({
  email: { type: String, require: true },
  recipes: [recipeSchema],
})

const UserModel = mongoose.model('recipe', userSchema)

module.exports = UserModel;
