const mongoose = require("mongoose");
const mongodb = require("../db_url");

const connect = async () => {
  try {
    await mongoose.connect(mongodb.MONGO_URL, { useNewUrlParser: true });
  } catch (err) {
    console.error("Error connecting to DB", err);
  }
};

module.exports = { connect };
