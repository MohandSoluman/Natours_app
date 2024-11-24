const Tour = require('../models/tour.model');
const fs = require('fs').promises;
const path = require('path');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');

const handleSuccess = (res, data, message = 'success', statusCode = 200) => {
  res.status(statusCode).json({
    status: message,
    results: data.length,
    data,
  });
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { newTour },
    });
    handleSuccess(res, newTour, 'Tour created successfully', 201);
  } catch (error) {
    handleError(res, error);
  }
};

const getAllTours = catchAsync(async (req, res) => {
  const featurs = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await featurs.query;
  handleSuccess(res, tours);
});

const getTourById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid tour ID format', 400));
  }

  const tour = await Tour.findById(id);

  if (!tour) {
    return next(new AppError('No tour found with this ID', 404));
  }

  handleSuccess(res, tour);
});

const updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError(`no tour found with this id `, 404));
  }
  handleSuccess(res, tour);
});

const deleteTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError(`no tour found with this id `, 404));
  }
  handleSuccess(res, tour);
});

//this function will run once on start project
const migrate = async (req, res, next) => {
  try {
    const filePath = path.join(__dirname, '../dev-data/data/tours.json');
    const data = await fs.readFile(filePath, 'utf-8'); // Use async file reading
    const tours = JSON.parse(data);

    await Tour.insertMany(tours);

    res.status(201).json({
      status: 'success',
      message: `${tours.length} elements added to the database successfully`,
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

const getStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: null,
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);
    handleSuccess(res, stats);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
  migrate,
  getStats,
};
