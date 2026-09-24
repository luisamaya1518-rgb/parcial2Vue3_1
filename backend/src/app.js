require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();
app.use(helmet());
app.use(cors({ origin: ['http://localhost:3001', 'http://localhost:5173'] }));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', require('./routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;