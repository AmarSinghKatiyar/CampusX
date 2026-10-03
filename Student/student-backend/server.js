require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./config/db');
const { verifyCloudinaryConfig } = require('./config/cloudinary');

/**
 * Handle Uncaught Exceptions
 */
process.on('uncaughtException', (err) => {
  console.error('\n❌ UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

/**
 * Validate Required Environment Variables
 */
const requiredEnv = [
  'MONGODB_URI',
  'JWT_SECRET',
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
}

// Port configuration
const PORT = process.env.PORT || 5001;

let server;

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Verify Cloudinary (Optional fallback)
    verifyCloudinaryConfig();

    // Start Express Server
    server = app.listen(PORT, () => {
      console.log('\n========================================');
      console.log('🚀 CampusIQ Student Backend Started');
      console.log('========================================');
      console.log(`📌 Environment : ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API URL     : http://localhost:${PORT}`);
      console.log(
        `🖥️ Frontend    : ${
          process.env.CLIENT_URL || 'http://localhost:5173'
        }`
      );
      console.log('========================================\n');
    });
  } catch (error) {
    console.error('\n❌ Failed to Start Student Server:', error);
    process.exit(1);
  }
};

/**
 * Handle Unhandled Promise Rejections
 */
process.on('unhandledRejection', (err) => {
  console.error('\n❌ UNHANDLED PROMISE REJECTION:', err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('SIGINT', () => {
  if (server) server.close(() => process.exit(0));
  else process.exit(0);
});

process.on('SIGTERM', () => {
  if (server) server.close(() => process.exit(0));
  else process.exit(0);
});

// Start the application
startServer();
