require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3330;
const app = express();

app.use(express.json());

// !connect with mongoose
mongoose
  .connect("mongodb://localhost:27017/nazmuldb", {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

// ! routeing
const router = require("./router/auth");
app.use(router);

// ! adding hbs
const hbs = require("hbs");
const path = require("path");
const staticPath = path.join(__dirname, "../public");
const partialsPath = path.join(__dirname, "../views/partial");
const viewsPath = path.join(__dirname, "../views");

app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.listen(PORT, () => {
  console.log("server created");
});
