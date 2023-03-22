const { connection } = require("./database/connection")
const express = require("express")
const cors = require("cors");
const res = require("express/lib/response");
//Initializing app
console.log("Initializing");

//Connect to database
connection();

//Create Node server
const app = express();
const port = 3900;

//Cors config
app.use(cors());

//Convert body to js object
app.use(express.json()); // Receive the data with content-type app/json
app.use(express.urlencoded({ extended: true })); //form-urlencoded

//Routes
const articleRoutes = require("./routes/article");

//Loaded routes
app.use("/api", articleRoutes);

//Test
app.get("/testing", (req, res) => {
  console.log("It has been executed on endpoint testing");

  return res.status(200).json([{
    title: "How to be a female programmer",
    author: "Stephanie Campos"
  },
  {
    title: "How to be a female programmer",
    author: "Stephanie Campos"
  }
  ]);
});

//Create server and listen http requests
app.listen(port, () => {
  console.log(`Server running in the port ${port}`);
})

