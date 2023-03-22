const express = require("express");
const router = express.Router();

// Article controller
const articleController = require("../controllers/article")

//Test route

//get "returns a resource"
router.get("/test-route", articleController.test);

//get "save a resource"
router.post("/create", articleController.create);


module.exports = router;