const mongoose = require("mongoose");

const url = process.env.MONGO_URI;
console.log("connecting to", url);
const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: true,
    });
    console.log("Connected to the database");
  } catch (err) {
    console.log("Something failed");
    process.exit(1);
  }
};

module.exports = connectDB;
