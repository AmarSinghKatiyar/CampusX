const mongoose = require("mongoose");
const dns = require("dns");

// Fix DNS SRV lookup on Windows networks for MongoDB Atlas
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  // Ignore
}

/**
 * Connect to MongoDB Atlas
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const connection = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Atlas connected successfully:", connection.connection.host);
    console.log("📁 Database:", connection.connection.name);

    return connection;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;