'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002

const mongoose = require('mongoose');
const { response } = require('express');
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/recipes', Recipe.getAllRecipes);
app.get('/recipes/:id', Recipe.getOneRecipe);
app.delete('/recipes/:id', Recipe.deleteRecipe);

app.use('*', (request, response) => {
  response.status(404).send('no tacos for u');
});

app.use( (error, request, reponse, next) => {
  response.status(500).send('oops our bad, still no tacos');
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));