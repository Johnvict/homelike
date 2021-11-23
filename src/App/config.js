const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config({ path: `${__dirname}/../config.env` });

const userRouter = require('../Routes/userRoutes');
const apartmentRouter = require('../Routes/apartmentRoutes');


const app = express();
const PORT = process.env.PORT || 8080;
const DB = process.env.DATABASE;

try {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('DB connected successfully'));
} catch (error) {
  console.error(
    'The app could not connect to Database due to: ',
    error.message
  );
  process.exit(1);
}

app.use('/api/v1/user', userRouter);
app.use('/api/v1/apartment', apartmentRouter);


module.exports = { app, PORT, DB };
