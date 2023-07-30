const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const router = require('./routes');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect(
  'mongodb://127.0.0.1:27017/bitfilmsdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

app.use(helmet());

app.use(bodyParser.json());

app.use(cors());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => console.log('started'));
