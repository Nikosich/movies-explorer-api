const userRouter = require('express').Router();

const {
  getUsers,
  updateUser,
} = require('../controllers/users');

const {
  validateUserUp,
} = require('../middlewares/validate');

userRouter.get('/users/me', getUsers);

userRouter.patch('/users/me', validateUserUp, updateUser);

module.exports = userRouter;
