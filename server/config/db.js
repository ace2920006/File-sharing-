const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/secureshare');
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.log('[Notice]: Ensure local MongoDB service is running on 127.0.0.1:27017 or update MONGO_URI in server/.env');
  }
};

module.exports = connectDB;
