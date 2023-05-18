const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoString);
    console.log(`Runnning on MongoDB ${mongoose.version}`);
    console.log("Database Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

// const User = require('../models/user');

// User.updateMany({biography: {$exists: true}}, {biography: "This is the default biography!"})
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

module.exports = connectToDatabase;

