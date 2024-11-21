const mongoose = require('mongoose');

// Main tour schema
const tourSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, 'A tour must have an ID'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
    min: [1, 'Duration must be at least 1 day'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a maximum group size'],
    min: [1, 'Group size must be at least 1'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty must be either: easy, medium, or difficult',
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be at least 1.0'],
    max: [5, 'Rating must be at most 5.0'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Ratings quantity cannot be negative'],
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
    min: [0, 'Price cannot be negative'],
  },
  summary: {
    type: String,
    required: [true, 'A tour must have a summary'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'A tour must have a description'],
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
