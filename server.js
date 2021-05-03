'use strict'
​
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
​
const PORT = process.env.PORT || 3002
​
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
​
app.get('/', (response, require) => {
    response.send('WE GOT TACOS!!!!!!');
});
​
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));