'use strict';
const Recipe = {};

// const superagent = require('superagent');
require('dotenv').config();

const User = require('./recipe-model.js');
// const hunter = new User({ email: 'huntergbritten@gmail.com', recipes: [{ title: 'great', image: 'jpg', summary: 'so yummy' }] });
// hunter.save();
const tacoRec = require('../tacorecipes.json');
// const { response } = require('express');

Recipe.getAllFilteredRecipes = async (request, response) => {
  // const meat = 'beef'
  const meat = request.query.meat;

  const vegetable = request.query.vegetable;
  const other = request.query.other;

  // const key = process.env.RECIPE_API_KEY;
  // const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&query=Taco&addRecipeInformation=true&number=100`
  // const urlResult = await superagent.get(url)
  // const recipes = await RecipeModel.find({});
  if (meat === 'Any') {
    if (vegetable === 'Any') {
      const filterOther = Recipe.filterRecipes(tacoRec.results, other.toLowerCase());

      const singleRecipes = filterOther.filter((val, idx, arr) => {
        if (idx === 0) {
          return val;
        } else {
          if (val.title !== arr[idx - 1].title) {
            return val;
          }
        }
      })

      const searchedRecipes = singleRecipes.map(recipe => new ShinyRecipes(recipe));

      console.log(searchedRecipes);
      response.status(200).json(searchedRecipes);
    } else {
      const filterVeg = Recipe.filterRecipes(tacoRec.results, vegetable.toLowerCase());
      const filterOther = Recipe.filterRecipes(filterVeg, other.toLowerCase());

      const singleRecipes = filterOther.filter((val, idx, arr) => {
        if (idx === 0) {
          return val;
        } else {
          if (val.title !== arr[idx - 1].title) {
            return val;
          }
        }
      })

      const searchedRecipes = singleRecipes.map(recipe => new ShinyRecipes(recipe));

      console.log(searchedRecipes);
      response.status(200).json(searchedRecipes);
    }
  } else {
    const filterMeat = Recipe.filterRecipes(tacoRec.results, meat.toLowerCase());
    if (vegetable === 'Any') {
      if (other === 'Any') {
        const singleRecipes = filterMeat.filter((val, idx, arr) => {
          if (idx === 0) {
            return val;
          } else {
            if (val.title !== arr[idx - 1].title) {
              return val;
            }
          }
        })

        const searchedRecipes = singleRecipes.map(recipe => new ShinyRecipes(recipe));
        console.log(searchedRecipes);
        response.status(200).json(searchedRecipes);
      } else {
        const filterOther = Recipe.filterRecipes(filterMeat, other.toLowerCase());

        const searchedRecipes = filterOther.map(recipe => new ShinyRecipes(recipe));

        console.log(searchedRecipes);
        response.status(200).json(searchedRecipes);

      }
    } else {
      const filterVeg = Recipe.filterRecipes(filterMeat, vegetable.toLowerCase());
      if (other === 'Any') {

        const singleRecipes = filterVeg.filter((val, idx, arr) => {
          if (idx === 0) {
            return val;
          } else {
            if (val.title !== arr[idx - 1].title) {
              return val;
            }
          }
        })

        const searchedRecipes = singleRecipes.map(recipe => new ShinyRecipes(recipe));

        console.log(searchedRecipes);
        response.status(200).json(searchedRecipes);
      } else {

        const filterOther = Recipe.filterRecipes(filterVeg, other.toLowerCase());
        console.log('filter', filterOther);

        const singleRecipes = filterOther.filter((val, idx, arr) => {
          if (idx === 0) {
            return val;
          } else {
            if (val.title !== arr[idx - 1].title) {
              return val;
            }
          }
        })

        const searchedRecipes = singleRecipes.map(recipe => new ShinyRecipes(recipe));

        console.log(searchedRecipes);
        response.status(200).json(searchedRecipes);
      }
    }

  }
}

class ShinyRecipes {
  constructor(recipe) {
    this.title = recipe.title;
    // this.ingredientName = recipe.analyzedInstructions.steps.ingredients.name,
    this.image = recipe.image;
    this.summary = recipe.summary;
    this.id = recipe.id;
  }

}

Recipe.getUserRecipes = async (request, response) => {
  const email = request.query.email;

  console.log(email);
  await User.find({ email }, (err, users) => {
    console.log('user 149', users);
    if (err) console.error(err);
    if (!users.length) {
      response.send('user not found');
    } else {
      const user = users[0];
      response.send(user.recipes);
    }
  })
}

Recipe.saveUserRecipe = (request, response) => {
  // console.log('made it', request.body);
  const { title, image, email, summary } = request.body;
  const newRecipe = { title, image, summary };
  User.find({ email }, (err, users) => {
    console.log(users);
    if (err) console.error(err);
    if (!users.length) {
      let newUser = new User({ email: email, recipes: [{ title: title, image: image, summary: summary }] })
      newUser.save();
      response.send(newUser.recipes);
      // if no user exists create one
    } else {
      const user = users[0];
      console.log('user', user)
      user.recipes.push(newRecipe);
      user.save();
      response.send(user.recipes);
      // response.send(user.newRecipe);

    }
  })
}

Recipe.filterRecipes = (arr, target) => {
  const filteredRecipesArr = [];
  for (let i = 0; i < arr.length; i++) {
    let steps = arr[i].analyzedInstructions.length > 0 ? arr[i].analyzedInstructions[0].steps : '';
    for (let j = 0; j < steps.length; j++) {
      // console.log(steps[j]);
      for (let k = 0; k < steps[j].ingredients.length; k++) {
        if (steps[j].ingredients[k].name.includes(target)) {
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
    response.status(200).send('tacos gone!');
  } catch (err) {
    console.error(err);
  }
}

module.exports = Recipe;
