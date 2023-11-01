const Movie = require("../models/movie");
const ReqError = require("../errors/ReqError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");

const getMovies = (req, res, next) => {
  Movie.find({})
    .populate(["owner"])
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
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
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
    owner: req.user._id,
  })
    .then((movie) => {
      movie
        .populate("owner")
        .then(() => res.status(201).send(movie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new ReqError("Некоректные данные."));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const { _id } = req.user;
  Movie.findById(movieId)
    /* eslint-disable consistent-return */
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError("Такого фильма нет."));
      }
      if (movie.owner.valueOf() !== _id) {
        return next(new ForbiddenError("Чужой фильм удалять нельзя"));
      }
      Movie.findByIdAndRemove(movieId)
        .then((deletedMovie) => res.status(200).send(deletedMovie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new ReqError("Некоректные данные."));
      }

      return next(err);
    });
};

module.exports = { getMovies, createMovie, deleteMovie };
