const Tour = require('../models/tour.model');
const fs = require('fs').promises;
const path = require('path');
const ApiFeatures = require('../utils/apiFeatures');

// Helper function for consistent error handling
const handleError = (
  res,
  error,
  statusCode = 400,
  message = 'An error occurred'
) => {
  res.status(statusCode).json({
    status: 'fail',
    message: typeof error === 'string' ? error : error.message || message,
  });
};
// Helper function for consistent success responses
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

const getAllTours = async (req, res) => {
  try {
    const featurs = new ApiFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await featurs.query;
    handleSuccess(res, tours);
  } catch (error) {
    handleError(res, error);
  }
};

const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return handleError(res, 'not found', 404);
    }
    handleSuccess(res, tour);
  } catch (error) {
    handleError(res, error);
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tour) {
      return handleError(res, 'not found', 404);
    }
    handleSuccess(res, tour);
  } catch (error) {
    handleError(res, error);
  }
};

const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
      return handleError(res, 'not found', 404);
    }
    handleSuccess(res, tour);
  } catch (error) {
    handleError(res, error);
  }
};

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

module.exports = {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
  migrate,
};
