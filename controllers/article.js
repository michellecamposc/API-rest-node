const validator = require("validator");
const Article = require("../models/Article");

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
    let validateTitle = !validator.isEmpty(parameters.title) && validator.isLength(parameters.title, { min: 5, max: undefined });
    let validateContent = !validator.isEmpty(parameters.content);

    if (!validateTitle || !validateContent) {
      throw new Error("The information has not been validated");
    }
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Missing data to send",
    });
  }

  // Create the object to save 
  const article = new Article(parameters); //Assign value based on object

  // Save the article in the database
  article.save()
    .then((articleSaved) => {
      return res.status(200).json({
        status: "success",
        article: articleSaved,
        message: "Article created successfully"
      });
    })
    .catch((error) => {
      return res.status(400).json({
        status: "error", error,
        message: "The article has not been saved",
      });
    });
};

// Method that returns all the articles saved in the database.
const listArticles = async (req, res) => {
  try {
    // Finds all documents in the "Article" collection of the database.
    const articlesDatabase = await Article.find({});
    if (!articlesDatabase) {
      return res.status(404).json({
        status: "error",
        message: "It have not found articles",
      });
    }
    return res.status(200).send({
      status: "success",
      articlesDatabase,
    });
  }

  catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
    });
  }
};


module.exports = {
  test,
  create,
  listArticles
};
