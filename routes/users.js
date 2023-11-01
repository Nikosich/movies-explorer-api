const userRouter = require('express').Router();

const {
  getUser,
  updateUser,
} = require('../controllers/users');

const {
  validateUserUp,
} = require('../middlewares/validate');

userRouter.get('/users/me', getUser);

userRouter.patch('/users/me', validateUserUp, updateUser);

module.exports = userRouter;
