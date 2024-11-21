const Tour = require('../models/tour.model');

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
    const tours = await Tour.find();
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

module.exports = {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
};
