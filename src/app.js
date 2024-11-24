const express = require('express');
const AppError = require('./utils/appError');
const gloableErrorHandler = require('./controllers/error.controller');

const app = express();
app.use(express.json());
console.log(app.get('env'));

const userRouter = require('./routes/user.routes');
const toureRouter = require('./routes/tour.routes');

app.use('/api/v1/tours', toureRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(gloableErrorHandler);

module.exports = app;
