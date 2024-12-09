import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.retryAttempts = 0;
    this.maxRetries = 3;
    this.retryInterval = 5000; // 5 seconds
  }

  async connect() {
    if (this.isConnected) {
      logger.info('Using existing database connection');
      return;
    }

    try {
      // Validate MongoDB URI
      if (!process.env.MONGODB_URI) {
        throw new Error('MongoDB URI is not defined in environment variables');
      }

      // Connection options
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      // Attempt connection
      const conn = await mongoose.connect(process.env.MONGODB_URI, options);
      
      this.isConnected = true;
      this.retryAttempts = 0;
      
      logger.info(`MongoDB Connected: ${conn.connection.host}`);
      logger.info(`Database Name: ${conn.connection.name}`);
      logger.info(`MongoDB Port: ${conn.connection.port}`);

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
        this.isConnected = false;
        this.attemptReconnection();
      });

      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
        this.isConnected = false;
        this.attemptReconnection();
      });

    } catch (error) {
      this.handleConnectionError(error);
    }
  }

  async handleConnectionError(error) {
    logger.error('Failed to connect to MongoDB:', error);

    // Error handling
    if (error.name === 'MongoServerSelectionError') {
      logger.error('Could not connect to MongoDB server. Please check if:');
      logger.error('1. MongoDB service is running (mongod process)');
      logger.error('2. MongoDB is listening on the correct port (default: 27017)');
      logger.error('3. No firewall is blocking the connection');
    }

    if (error.name === 'MongoParseError') {
      logger.error('Invalid MongoDB connection string. Please check:');
      logger.error('1. Connection string format is correct');
      logger.error('2. Database name is properly specified');
      logger.error('3. No special characters are causing parsing issues');
    }

    if (error.name === 'MongooseServerSelectionError') {
      logger.error('MongoDB server selection failed. Please verify:');
      logger.error('1. MongoDB service status');
      logger.error('2. Network connectivity');
      logger.error('3. Authentication credentials (if required)');
    }

    // Attempt reconnection if within retry limits
    if (this.retryAttempts < this.maxRetries) {
      this.attemptReconnection();
    } else {
      logger.error(`Failed to connect after ${this.maxRetries} attempts. Please check your MongoDB installation and configuration.`);
      process.exit(1);
    }
  }

  async attemptReconnection() {
    if (this.retryAttempts >= this.maxRetries) {
      return;
    }

    this.retryAttempts++;
    logger.info(`Attempting to reconnect to MongoDB (Attempt ${this.retryAttempts}/${this.maxRetries})`);

    setTimeout(() => {
      this.connect()
        .catch(error => {
          logger.error(`Reconnection attempt ${this.retryAttempts} failed:`, error);
        });
    }, this.retryInterval);
  }

  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('Disconnected from MongoDB');
    } catch (error) {
      logger.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  // check MongoDB connection status
  async checkConnection() {
    if (!this.isConnected) {
      return {
        status: 'disconnected',
        message: 'Not connected to MongoDB'
      };
    }

    try {
      await mongoose.connection.db.admin().ping();
      return {
        status: 'connected',
        message: 'Successfully connected to MongoDB',
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Connection check failed',
        error: error.message
      };
    }
  }
}

// Export a singleton instance
const dbConnection = new DatabaseConnection();
export const connectDB = () => dbConnection.connect();
export const disconnectDB = () => dbConnection.disconnect();
export const checkDBConnection = () => dbConnection.checkConnection();