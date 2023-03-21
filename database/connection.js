const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Blog");
    console.log("Successfully connected to the my blog database");
  }
  catch (err) {
    console.log(err);
    throw new Error("Failed to connect to the database");

  }
}

module.exports = {
  connection
}