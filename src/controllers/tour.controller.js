const Tour = require('../models/tour.model');
const fs = require('fs').promises;
const path = require('path');
const factory = require('./handlerFactory');

const handleSuccess = (res, data, message = 'success', statusCode = 200) => {
  res.status(statusCode).json({
    status: message,
    results: data.length,
    data,
  });
};

exports.createTour = factory.createOne(Tour);
exports.getAllTours = factory.getAll(Tour);
exports.getTourById = factory.getOne(Tour, { path: 'reviews' });
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

//this function will run once on start project
exports.migrate = async (req, res, next) => {
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

exports.getStats = async (req, res) => {
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
