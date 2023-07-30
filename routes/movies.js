const movieRouter = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  validateCreateMovie,
  validateDeleteMovie,
} = require('../middlewares/validate');

movieRouter.get('/movies', getMovies);

movieRouter.post('/movies', validateCreateMovie, createMovie);

movieRouter.delete('movies/:_id', validateDeleteMovie, deleteMovie);

module.exports = movieRouter;
