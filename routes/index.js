const router = require('express').Router();

const cors = require('cors');

const auth = require('../middlewares/auth');

const userRouter = require('./users');

const movieRouter = require('./movies');

const NotFoundError = require('../errors/NotFoundError');

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://api.mesto.nksch.nomoredom.nomoredomains.rocks',
  'https://api.mesto.nksch.nomoredom.nomoredomains.rocks',
  'http://mesto.nksch.nomoredomains.rocks',
  'https://mesto.nksch.nomoredomains.rocks',
  'http://51.250.72.163:3000',
];

const {
  createUser,
  login,
} = require('../controllers/users');

const {
  validateSignup,
  validateSignin,
} = require('../middlewares/validate');

router.use(cors({
  origin: allowedCors,
  credentials: true,
}));

router.post('/signup', validateSignup, createUser);

router.post('/signin', validateSignin, login);

router.use(auth, userRouter);

router.use(auth, movieRouter);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует.'));
});

module.exports = router;
