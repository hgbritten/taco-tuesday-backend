'use strict';

const superagent = require('superagent');
require('dotenv').config();


const RecipeModel = require('./recipe-model.js');

const Recipe = {};

Recipe.getAllRecipes = async(request, response) => {
  const key = process.env.RECIPE_API_KEY;
  const { stuffINeed } = request.body;
  // const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey${key}ingredients=apples,+flour,+sugar&number=10`
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&query=Taco&addRecipeInformation=true&number=100`
  const urlResult = await superagent.get(url)
  for(let i = 0; i < urlResult.body.results.length; i++){
    let steps = urlResult.body.results[i].analyzedInstructions[0].steps;
  for(let j = 0; j < steps.length; j++){
    for(let k = 0; steps[j].ingredients.length; k++){
      if(steps[j].ingredients[k].name === target){
        return urlResult.body.results[i]
      }
    }
  }
}
  const recipes = await RecipeModel.find({});
  response.status(200).json(recipes);
}

Recipe.getOneRecipe = async(request, response) => {
  const id = request.params.id;
  const recipes = await RecipeModel.find({_id:id});
  response.status(200).json(recipes[0]);
}

Recipe.deleteRecipe = async(request, response) => {
  try {
    const id = request.params.id;
    console.log(id);
    await RecipeModel.deleteOne({_id:id});
    response.status(200).send('tacos!');
  } catch(err) {
    console.error(err);
  }
}

module.exports = Recipe;
