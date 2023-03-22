const { send } = require("express/lib/response");
const validator = require("validator");

const test = (req, res) => {
  return res.status(200).json({
    message: "Testing test controllers",
  });
};

const create = (req, res) => {

  // Collect the data to save
  let parameters = req.body;

  // Validate data
  try {
    let validateTittle = !validator.isEmpty(parameters.tittle) && validator.isLength(parameters.tittle, { min: 5, max: undefined });
    let validateContent = !validator.isEmpty(parameters.content);

    if (!validateTittle || !validateContent) {
      throw new Error("The information has not been validated");
    }
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Missing data to send",
    });
  }

  // Create the object to save




  // Assign values to the object based on the model

  // Save the article in the database

  // Return result

  return res.status(200).json({
    message: "Save action",
    parameters,
  });
};

module.exports = {
  test,
  create,
};
