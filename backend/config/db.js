const mongoose = require('mongoose');

const connectDB = async (retries = 5, delay = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000, // 10 second timeout
        socketTimeoutMS: 45000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`);

      if (attempt === retries) {
        console.error('🚫 All MongoDB connection attempts exhausted. Please check:');
        console.error('   1. Your internet connection');
        console.error('   2. MongoDB Atlas IP whitelist (Network Access → Add your IP)');
        console.error('   3. Your MONGO_URI in .env is correct');
        process.exit(1);
      }

      console.log(`⏳ Retrying in ${delay / 1000}s...`);
      await new Promise((res) => setTimeout(res, delay));
      delay *= 1.5; // exponential backoff
    }
  }
};

module.exports = connectDB;
