const express = require("express");
const router = express.Router();

// Article controller
const articleController = require("../controllers/article")

// Get "returns a resource"
router.get("/test-route", articleController.test);

// Get "save a resource"
router.post("/create", articleController.create);
router.get("/articles", articleController.listArticles);
router.get("/article/:id", articleController.oneArticle);
router.get("/article/:id", articleController.oneArticle);

// Delete method Http
router.delete("/article/:id", articleController.deleteArticle);



module.exports = router;