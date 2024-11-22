const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tour.controller');

router
  .route('/')
  .post(tourController.createTour)
  .get(tourController.getAllTours);

// .post(tourController.migrate);

router
  .route('/:id')
  .get(tourController.getTourById)
  .put(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
