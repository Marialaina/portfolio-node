//grabbing the environment variables
require("dotenv").config();

//IMPORTING EXPRESS and create express application
const express = require("express");
const app = express();

// GET PORT FROM ENV OR DEFAULT PORT
const PORT = process.env.PORT || "2021";
const SECRET = process.env.SECRET || "secret";

//IMPORTING MIDDLEWARE
const methodOverride = require("method-override");
const morgan = require("morgan");
const cors = require("cors");
app.use(cors()); // Prevent Cors Errors if building an API
app.use(methodOverride("_method")); // Swap method of requests with _method query
app.use(express.static("public")); // serve the public folder as static
app.use(morgan("tiny")); // Request Logging
app.use(express.json()); // Parse json bodies
app.use(express.urlencoded({ extended: false })); //parse bodies from form submissions

//IMPORT DATABASE CONNECTION
const mongoose = require("./db/connection");

// Sessions Middleware
const session = require("express-session"); // create session cookies
const connect = require("connect-mongodb-session")(session); // store cookies in mongo
// SESSION MIDDLEWARE REGISTRATION (adds req.session property)
app.use(
    session({
      secret: SECRET,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
      saveUninitialized: true, // create session regardless of changes
      resave: true, //save regardless of changes
      store: new connect({
        uri: process.env.MONGODB_URL,
        databaseName: "sessions",
        collection: "sessions",
      }),
    })
  );

// Set the View Engine
app.set("view engine", "ejs");

// LOGIN ROUTER
const LoginRouter = require("./routes/home");
app.use("/", LoginRouter)

app.get("/home", (req, res) => {
  res.send("Home")
});

//this router needs to fixed
//PROJECTS ROUTER
// const ProjectRouter = require("./routes/projects");




app.listen(PORT, () =>
  console.log("🚀 Server Launch 🚀", `Listening on Port ${PORT}`)
);