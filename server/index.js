import express from 'express';
import cors from 'cors'; // Cross-Origin Resource Sharing
import dotenv from 'dotenv'; // Environment variables
import helmet from 'helmet'; // Security middleware
import compression from 'compression'; // Compress responses
import rateLimit from 'express-rate-limit';  // Rate limiting
import { connectDB } from './config/database.js'; // Database connection
import { logger } from './utils/logger.js'; // Logger
import authRoutes from './routes/auth.routes.js'; 
import ocrRoutes from './routes/ocr.routes.js'; 
import errorHandler from './middleware/errorHandler.js';

dotenv.config(); // Load environment variables

const app = express();  // Create Express app

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