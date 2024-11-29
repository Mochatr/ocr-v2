import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database.js';
import { logger } from './utils/logger.js';
import authRoutes from './routes/auth.routes.js';
import ocrRoutes from './routes/ocr.routes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ocr', ocrRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Failed to connect to database:', error);
    process.exit(1);
  });

export default app;