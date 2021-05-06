'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002
const Recipe = require('./src/recipes');

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => console.log('Mongoose connected'));

app.get('/recipes', Recipe.getAllFilteredRecipes);
app.get('/recipes/:id', Recipe.getUserRecipes);
app.post('/recipes/:id', Recipe.saveUserRecipe);
app.delete('/recipes/:id', Recipe.deleteRecipe);

app.use('*', (request, response) => {
  response.status(404).send('no tacos for u');
});

app.use((error, request, reponse, next) => {
  response.status(500).send('oops our bad, still no tacos');
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));