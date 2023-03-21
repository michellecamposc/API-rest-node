const { connection } = require("./database/connection")
const express = require("express")

//Initializing app
console.log("Initializing");

//Connect to database
connection();
