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

// const Product = require('../models/product');

// Product.updateMany({image: {$exists: false}}, {image: "https://res.cloudinary.com/dbml6cgrf/image/upload/v1682532766/HAFIT/Shared/default_quykfo.png"})
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

module.exports = connectToDatabase;

