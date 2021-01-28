//RESTful API to get,post,put,patch,delete the articles
const express = require("express");

const bodyParser = require("body-parser");

const ejs = require("ejs");

const mongoose = require("mongoose");

//mongodb atlas connection(database name -> wikiDB)
mongoose.connect(
  "mongodb+srv://shubham:<password>@cluster0.3x7kg.mongodb.net/wikiDB",
  { useUnifiedTopology: true, useNewUrlParser: true }
);

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

//creating schema for articles collection
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

//model for articles collection
const Article = mongoose.model("Article", articleSchema);


//route chaining for requeting all articles
app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, articles) {
      if (!err) {
        res.send(articles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    article.save(function (err) {
      if (!err) {
        res.send("Data saved successfully!");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("All articles are deleted!");
      } else {
        res.send(err);
      }
    });
  });

//route chaining for requesting a particular article

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    const paramTitle = req.params.articleTitle;
    Article.findOne({ title: paramTitle }, function (err, article) {
      if (!err) {
        res.send(article);
      } else {
        res.send(err);
      }
    });
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("successfully updated.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("updated successfully!");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Successfully deleted!");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("server is running on port 3000");
});
