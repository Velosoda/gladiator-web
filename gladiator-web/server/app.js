require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const HttpError = require('./models/http-error');

const app = express();
app.use(bodyParser.json());

require('./models/Move');
require('./models/PracticePerson');
require('./models/Fighter');
require('./models/Attacks');

const movesRoutes = require('./routes/api/moves');
const practiceRoutes = require('./routes/api/practice');
const fightersRoutes = require('./routes/api/fighters');

app.use('/api/moves', movesRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/fighters', fightersRoutes);

var isProduction = process.env.NODE_ENV === 'production';

var uri = ""
if(isProduction){
  mongoose.connect(process.env.MONGODB_URI);
} else {
  const mongoUser = process.env.MONGO_DB_USER
  const mongoPassword = process.env.MONGO_DB_PASSWORD
  const mongoAddress = process.env.MONGO_DB_ADDRESS
  uri = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoAddress}/?retryWrites=true&w=majority`;

  mongoose.connect(uri);
  mongoose.set('debug', true);
}

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred!'});
});

// finally, let's start our server...
var server = app.listen( process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});
