const express = require('express');

const app = express();
app.use(express.json());
console.log(app.get('env'));

const userRouter = require('./routes/user.routes');
const toureRouter = require('./routes/tour.routes');

app.use('/api/v1/tours', toureRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
