const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      validate: {
        validator: (v) => {
          validator.isURL(v);
        },
      },
      required: true,
    },
    trailerLink: {
      type: String,
      validate: {
        validator: (v) => {
          validator.isURL(v);
        },
      },
      required: true,
    },
    thumbnail: {
      type: String,
      validate: {
        validator: (v) => {
          validator.isURL(v);
        },
      },
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'movie',
    },
    nameRU: {
      type: Number,
      required: true,
    },
    nameEN: {
      type: Number,
      required: true,
    },
  },
);

module.exports = mongoose.model('movie', movieSchema);
