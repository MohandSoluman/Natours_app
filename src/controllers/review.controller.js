const Review = require('./../models/review.model');
const factory = require('./handlerFactory');
const fs = require('fs').promises;
const path = require('path');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.migrate = async (req, res, next) => {
  try {
    const filePath = path.join(__dirname, '../dev-data/data/reviews.json');
    const data = await fs.readFile(filePath, 'utf-8'); // Use async file reading
    const reviews = JSON.parse(data);

    await Review.insertMany(reviews);

    res.status(201).json({
      status: 'success',
      message: `${reviews.length} elements added to the database successfully`,
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
