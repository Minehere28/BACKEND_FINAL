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
import taskRouter from './routes/tasks.routes.js';
import subBoardRouter from './routes/subBoards.routes.js';
import commentRouter from './routes/comments.routes.js';
import teamRouter from './routes/team.routes.js';

const app = express();

// Connect to MongoDB
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
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
app.use('/api/users', authRouter);
app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/subboards', subBoardRouter);
app.use('/api/comments', commentRouter);
app.use('/api/teams', teamRouter);

// Handle non-existing routes
app.all('*', (req, res, next) => {
  next(new AppError(`Không tìm thấy ${req.originalUrl} trên server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

// Compression (should be after routes)
app.use(compression());

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥', err);
  process.exit(1);
});

export default app;
