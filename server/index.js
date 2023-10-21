import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';

const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

// db connection
mongoose.set('strictQuery', false); // required for version 6
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB connected'))
  .catch((err) => console.log('DB CONNECTION ERROR: ', err));

// middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// route middlewares
app.use('/api', authRoutes);

app.listen(8000, () => console.log('Server running on port 8000'));
