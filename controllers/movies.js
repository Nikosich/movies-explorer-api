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
  Movie.findById({ _id: req.params.movieId })
    .populate(['owner'])
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      } else if (!(req.user._id === movie.owner._id.toString())) {
        throw new ForbiddenError('Чужой филь удалить нельзя');
      } else {
        movie.deleteOne()
          .then((myMovie) => {
            res.status(200).send({ myMovie });
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = { getMovies, createMovie, deleteMovie };
