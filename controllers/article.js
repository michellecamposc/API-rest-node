const Article = require("../models/Article");
const { validateArticle } = require("../helpers/validate");
const path = require("path");
// Mime is used to describe the data and its format
const mime = require("mime-types");
const fs = require("fs");
const res = require("express/lib/response");

const test = (req, res) => {
  return res.status(200).json({
    message: "Testing test controllers",
  });
};

const create = (req, res) => {
  // Collect the data to save
  let parameters = req.body;

  //Validate data
  try {
    validateArticle(parameters);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Missing data to send",
    });
  }

  // Create the object to save
  const article = new Article(parameters); //Assign value based on object

  // Save the article in the database
  article
    .save()
    .then((articleSaved) => {
      return res.status(200).json({
        status: "success",
        article: articleSaved,
        message: "Article created successfully",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        status: "error",
        error,
        message: "The article has not been saved",
      });
    });
};

// Method that returns all the articles saved in the database.
const listArticles = async (req, res) => {
  try {
    // Finds all documents in the "Article" collection of the database.
    // Limit the number of documents returned
    const consultDatabase = await Article.find({}).sort({ date: -1 }).limit(4);
    if (!consultDatabase) {
      return res.status(404).json({
        status: "error",
        message: "It have not found articles",
      });
    }
    return res.status(200).send({
      status: "success",
      consultDatabase,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Return just one article
const oneArticle = async (req, res) => {
  try {
    // Collect id by url
    let id = req.params.id;

    // Find the article with findById method
    let article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        status: "error",
        message: "It have not found the article",
      });
    }

    // Return the result
    return res.status(200).json({
      status: "success",
      article,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

//Delete an article
const deleteArticle = async (req, res) => {
  // Collect id by url
  let articleId = req.params.id;

  // Delete the article with findOneAndDelete method
  let deleteArticle = await Article.findOneAndDelete({ _id: articleId });
  try {
    if (!deleteArticle) {
      return res.status(404).json({
        status: "error",
        message: "Error deleting article",
      });
    }

    return res.status(200).json({
      status: "success",
      article: deleteArticle,
      message: "Delete method",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

//Edite an article
const editArticle = async (req, res) => {
  let articleId = req.params.id;

  // Collect the data to save
  let parameters = req.body;

  //Validate data
  try {
    validateArticle(parameters);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Missing data to send",
    });
  }

  // Find and update the article
  let findArt = await Article.findOneAndUpdate({ _id: articleId }, parameters, {
    new: true,
  });
  try {
    if (!findArt) {
      return res.status(404).json({
        status: "error",
        message: "Failed to update ",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Article updated",
      article: findArt,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

// Upload an image
const uploadImage = async (req, res) => {
  // If an image has not been uploaded
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      message: "No file was uploaded",
    });
  }

  // Know the file extension
  let fileName = req.file.originalname;
  let fileExtension = path.extname(fileName);

  //Verify the file extension is an image
  const isImage = mime.lookup(fileExtension).match(/^image\//);

  if (!isImage) {
    // Delete the file
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.log(err);
      }
    });

    return res.status(400).json({
      status: "error",
      message: "Only image files are allowed",
    });
  } else {
    // Collect id by url
    let articleId = req.params.id;

    // Find and update the article
    let updatedArticle = await Article.findOneAndUpdate(
      { _id: articleId },
      { image: req.file.filename },
      { new: true }
    );
    try {
      if (!updatedArticle) {
        return res.status(404).json({
          status: "error",
          message: "Failed to update",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Article updated",
        article: updatedArticle,
        file: req.file,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Something went wrong!",
      });
    }
  }
};

// To show the images
const image = (req, res) => {
  let file = req.params.file;
  let pathFile = path.join(__dirname, "../images/articles/", file);

  if (fs.existsSync(pathFile)) {
    res.sendFile(
      pathFile,
      {
        headers: {
          "Content-Type": "image/png",
        },
        maxAge: 3600000,
      },
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({
            status: "error",
            message: "Error sending image",
          });
        }
      }
    );
  } else {
    return res.status(404).json({
      status: "error",
      message: "The image does not exist",
    });
  }
};


// Search the articles database for those containing a given search string.
const searcher = (req, res) => {
  let search = req.params.search;

  Article.find({
    $or: [
      // Regex performs case insensitive searches.
      { title: { $regex: new RegExp(search, "i") } },
      { content: { $regex: new RegExp(search, "i") } },
    ],
  })
    .sort({ date: -1 })
    .then((foundArticles) => {
      if (!foundArticles.length) {
        return res.status(404).json({
          status: "error",
          message: "It has not found articles",
        });
      }

      return res.status(200).json({
        status: "success",
        articles: foundArticles,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    });
};

module.exports = {
  test,
  create,
  listArticles,
  oneArticle,
  deleteArticle,
  editArticle,
  uploadImage,
  image,
  searcher,
};
