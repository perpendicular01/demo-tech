const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");

dotenv.config({ path: "./db.env" });

const app = express();
//Use the static html/css files
//app.use(express.static("./frontend"));
app.use(express.static("./frontend/scripts"));
app.use(express.static("./frontend/styles"));
app.use(express.static("./frontend/sources"));

//Parse url encoded bodies(as sent by html forms)
app.use(express.urlencoded({ extended: true }));
//pars json bodies(as sent by API clients)
app.use(express.json());
//Registering expression-session as Global Middleware
app.use(
  session({
    secret: "thisismysecretdonttellanyone!",
    resave: false, // Set to false to avoid saving the session on every request
    saveUninitialized: true, // Set to true to save uninitialized sessions
    cookie: {
      sameSite: "strict",
      maxAge: 1000 * 60 * 10,
      // secure: true,
      // httpOnly: true
    },
  })
);
//scraping monitor data from startech

app.use("/", require("./routes/frontend.js"));
app.use("/backend", require("./routes/backend.js"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
