const express = require('express');
const AppError = require('./utils/appError');
const gloableErrorHandler = require('./controllers/error.controller');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const XSS = require('xss-clean');
const path = require('path');
const userRouter = require('./routes/user.routes');
const toureRouter = require('./routes/tour.routes');
const reviewRouter = require('./routes/review.routes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

console.log(app.get('env'));
const limiter = rateLimit({
  max: 5,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, Please try again in an hour!',
});

app.use('/api', limiter);
app.use(helmet());

app.use(express.json({ limit: '10kb' }));

//data sanitization against NoSQL query injection
app.use(mongoSanitize());

//data sanitization against XSS
app.use(XSS());

app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
  res.status(200).render('base');
});

app.get('/', (req, res) => {
  res.status(200).render('tour');
});

app.get('/tour', (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
});

app.use('/api/v1/tours', toureRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(gloableErrorHandler);

module.exports = app;
