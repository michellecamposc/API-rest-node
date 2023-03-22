const validator = require("validator");

//Validate data
const validateArticle = (parameters) => {
  let validateTitle =
    !validator.isEmpty(parameters.title) &&
    validator.isLength(parameters.title, { min: 5, max: undefined });
  let validateContent = !validator.isEmpty(parameters.content);

  if (!validateTitle || !validateContent) {
    throw new Error("The information has not been validated");
  }
};



module.exports = {
  validateArticle
}