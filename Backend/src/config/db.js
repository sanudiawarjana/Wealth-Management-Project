const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    const conn = await mongoose.connect(config.mongoUri, options);
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    // Don't exit immediately, give it a chance to reconnect
    setTimeout(() => {
      if (!mongoose.connection.readyState) {
        console.error('Could not connect to MongoDB.');
        if (process.env.NODE_ENV !== 'development') {
          console.error('Exiting due to MongoDB connection failure');
          process.exit(1);
        } else {
          console.warn('Continuing in development mode without DB connection');
        }
      }
    }, 5000);
  }
};

module.exports = connectDB;