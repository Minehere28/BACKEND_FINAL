import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './middlewares/errorHandler.js';

// Routes
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import eventRouter from './routes/event.routes.js';


const app = express();

connectDB();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  message: 'Quá nhiều requests từ IP này, vui lòng thử lại sau 15 phút'
});
app.use('/api', limiter);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.options('*', cors());

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
  });
});

// Routes
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/events', eventRouter);


app.all('*', (req, res, next) => {
  next(new AppError(`Không tìm thấy ${req.originalUrl} trên server!`, 404));
});

app.use(globalErrorHandler);

app.use(compression());

const port = 3001;
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});


export default app;
