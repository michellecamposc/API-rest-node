const express = require("express");
const multer = require("multer")
const router = express.Router();
// Article controller
const articleController = require("../controllers/article");


//Image storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, "./images/articles") }, filename: function (req, file, cb) { cb(null, "article" + Date.now() + file.originalname) }
});

const uploadImageStorage = multer({ storage: storage })

// Get "returns a resource"
router.get("/test-route", articleController.test);

// Get "save a resource"
router.post("/create", articleController.create);
router.get("/articles", articleController.listArticles);
router.get("/article/:id", articleController.oneArticle);
router.get("/article/:id", articleController.oneArticle);

// Delete method Http
router.delete("/article/:id", articleController.deleteArticle);

// Edit method Http
router.put("/article/:id", articleController.editArticle);

// Upload an image
router.post("/upload-image/:id", [uploadImageStorage.single("file")], articleController.uploadImage);

module.exports = router;