import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import connectDB from './databases/database.connection.js';
import routers from './apis/index.js';
import errorHandler from './middlewares/error.middleware.js';
import uploadRoute from './routes/upload.route.js'; 

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

connectDB().then(() => {
  // Routes
  app.use('/apis', routers);

    // Thêm route upload (có thể đặt prefix khác nếu cần)
    app.use('/apis/upload', uploadRoute);
  
  // Error handler middleware
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Upload route available at: http://localhost:${port}/apis/upload`);
  });
}).catch(error => {
  console.error('Database connection failed:', error);
  process.exit(1);
});