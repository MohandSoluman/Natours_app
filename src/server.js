require('dotenv').config();
const mongoose = require('mongoose');
const dbConfig = require('../db.config');

const { urlFromLocal, urlFromContainer } = dbConfig;

let url = urlFromContainer;

if (process.env.NODE_ENV === 'development') {
  url = urlFromLocal;
}

mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to MongoDB env = ', process.env.NODE_ENV);
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });

const app = require('./app');

const { PORT } = process.env;
const server = app.listen(PORT, () => {
  console.log(`start listning at port ${PORT}.......`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
