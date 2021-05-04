'use strict';
const Recipe = {};

const superagent = require('superagent');
require('dotenv').config();


const User = require('./recipe-model.js');
const tacoRec = require('../tacorecipes.json');
// const { response } = require('express');



Recipe.getAllRecipes = async (request, response) => {
  // const id = request.params.id;
  const ingredient = 'beef'
  // const ingredient = request.body.ingredient;
  // const ingredient2 = request.body.ingredient2;
  // const ingredient3 = request.body.ingredient3;

  const key = process.env.RECIPE_API_KEY;
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&query=Taco&addRecipeInformation=true&number=100`
  const urlResult = await superagent.get(url)
  // const recipes = await RecipeModel.find({});
  const filter = Recipe.filterRecipes(tacoRec.results, ingredient);
  // const filter2 = Recipe.filterRecipes(filter, ingredient2);
  // const filter3 = Recipe.filterRecipes(filter2, ingredient3);

  const searchedRecipes = filter3.map(recipe => new ShinyRecipes(recipe));

  console.log(filter.length);
  response.status(200).json(urlResult.body);
}

class ShinyRecipes {
  constructor(recipe) {
    this.title = recipe.title,
      this.instructions = recipe.analyzedInstructions.steps.ingredients,
      this.image = recipe.image,
      this.summary = recipe.summary;
  }

}

Recipe.getUserRecipes = async (request, response) => {
  const email = request.query.email;

  await User.find({ email }), (err, users) => {
    if (err) console.error(err);
    if (!users.length) {
      response.send('user not found');
    } else {
      const user = users[0];
      response.send(user.recipes);
    }
  }
}


Recipe.filterRecipes = (arr, target) => {
  const filteredRecipesArr = [];
  for (let i = 0; i < arr.length; i++) {
    let steps = arr[i].analyzedInstructions.length > 0 ? arr[i].analyzedInstructions[0].steps : '';
    for (let j = 0; j < steps.length; j++) {
      // console.log(steps[j]);
      for (let k = 0; k < steps[j].ingredients.length; k++) {
        if (steps[j].ingredients[k].name === target) {
          filteredRecipesArr.push(arr[i]);
        }
      }
    }
  }
  return filteredRecipesArr;
}



// Recipe.filterRecipes = async (request, response) => {
//   const key = process.env.RECIPE_API_KEY;
//   const { ingredient1 } = request.body;
//   const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&query=Taco&addRecipeInformation=true&number=100`
//   const urlResult = await superagent.get(url)
//   for (let i = 0; i < urlResult.body.results.length; i++) {
//     let steps = urlResult.body.results[i].analyzedInstructions[0].steps;
//     for (let j = 0; j < steps.length; j++) {
//       for (let k = 0; steps[j].ingredients.length; k++) {
//         if (steps[j].ingredients[k].name === ingredient1 || ingredient2 || ingredient3) {
//           return urlResult.body.results[i]
//           // need to be able to filter for more targets
//         }
//       }
//     }
//   }
//   const recipes = await RecipeModel.find({ _id: id });
//   response.status(200).json(recipes);
// }

Recipe.deleteRecipe = async (request, response) => {
  try {
    const id = request.params.id;
    console.log(id);
    await User.deleteOne({ _id: id });
    response.status(200).send('tacos!');
  } catch (err) {
    console.error(err);
  }
}

module.exports = Recipe;
