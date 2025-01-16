const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const fs = require('fs').promises;
const path = require('path');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.getUserById = factory.getOne(User);
exports.createUser = factory.createOne(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'this route is not for Password updates please use /updateMyPassword',
        400
      )
    );
  }

  const filterBody = filterObj(req.body, 'name', 'email');
  const user = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'No user found with that ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'No user found with that ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.migrate = async (req, res, next) => {
  try {
    const filePath = path.join(__dirname, '../dev-data/data/users.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const users = JSON.parse(data);

    await User.insertMany(users, {
      validateBeforeSave: false,
    });

    res.status(201).json({
      status: 'success',
      message: `${users.length} elements added to the database successfully`,
    });
  } catch (error) {
    console.error('Migration Error:', error.message);

    // Handle error response
    res.status(500).json({
      status: 'fail',
      message: 'An error occurred during migration',
      error: error.message,
    });
  }
};
