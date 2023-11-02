const Movie = require("../models/movie");
const ReqError = require("../errors/ReqError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({})
    .populate([owner])
    .then((movies) => res.status(200).send(movies.reverse()))
    .catch(() => res.status(500).send({ message: "Ошибка сервера" }))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  console.log(owner);
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqError('Данные не верны.'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const movieId = req.params._id;

  Movie.findById({ _id: movieId })
    .orFail(new NotFoundError("Не найдено"))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError("Чужой фильм удалить нельзя");
      }
      return Movie.findByIdAndRemove({ _id: movieId })
        .then((deletedMovie) => res.status(200).send(deletedMovie))
        .catch(next);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new ValidationError("Неверные данные"));
      }
      next(error);
    });
};

module.exports = { getMovies, createMovie, deleteMovie };
