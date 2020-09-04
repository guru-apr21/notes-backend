const mongoose = require("mongoose");
const config = require("config");

const url = config.get("db");
console.log("connecting to", url);
const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("Connected to the database");
  } catch (err) {
    console.log("Something failed");
    process.exit(1);
  }
};

module.exports = connectDB;
