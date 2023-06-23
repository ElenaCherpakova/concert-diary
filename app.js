require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');

const port = process.env.PORT || 3000;
const connectDB = require('./db/connect');
const mongoDB = process.env.MONGO_URI;
const passport = require('passport');
const mainController = require('./server/routes/index')
// Template engine
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(ejsLayouts);

// Routes
app.use('/', mainController)

app.all('*', (req, res) => {
  res.status(404).send('<h1>Resource not found</h1>');
});

const start = async () => {
  try {
    await connectDB(mongoDB);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
