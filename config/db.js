const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoString);
    console.log(`Runnning on MongoDB ${mongoose.version}`);
    console.log('Database Connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = connectToDatabase;