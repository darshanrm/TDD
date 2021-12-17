const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Admin:Admin@cluster0.tne8r.mongodb.net/todo-tdd?retryWrites=true&w=majority",
      { useNewUrlParser: true }
    );
  } catch (err) {
    console.error("Error connecting to DB", err);
  }
};

module.exports = { connect };
