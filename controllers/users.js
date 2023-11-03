const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const ConflictError = require('../errors/ConflictError');
const ReqError = require('../errors/ReqError');
const AuthorizationError = require('../errors/AuthorizationError');
const NotFoundError = require('../errors/NotFoundError');

const getUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь c указанным _id не найден');
      }
      res.status(200).send({ user });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new AuthorizationError('Неверные данные'));
      }
      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) {
            return next(new AuthorizationError('Неверные данные'));
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secretKey', { expiresIn: '7d' });
          return res.status(200).send({ token });
        });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    next(new ReqError('Некоректные данные.'));
  }

  return User.findOne({ email }).then((user) => {
    if (user) {
      next(new ConflictError('Этот email уже зарегестрирован'));
    }

    return bcrypt.hash(password, 10);
  })
    .then((hash) => User.create({
      email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ReqError('Некоректные данные.'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      return next(err);
    });
};

const updateUser = async (req, res, next) => {
  const { name, email } = req.body;

  try {
    const emailRegistered = await isEmailRegistered(email);
    if (emailRegistered) {
      throw new ConflictError('Пользователь с таким email уже существует');
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    }

    res.send({ user });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      const message = Object.values(err.errors).map((error) => error.message).join('; ');
      next(new BadRequestError(message));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  login,
};
