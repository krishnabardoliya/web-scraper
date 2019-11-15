var express = require("express");
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var app = express();
const cors = require('cors');

app.use(cors()) 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.listen("8081");

app.post("/scrape", function(req, res) {
  try {
    console.log(req.body);
    var url = req.body.url;
    if (url) {
      request(url, function(error, response, html) {
        if (!error) {
          console.log("response =>", response);
          var $ = cheerio.load(html);
          
          console.log("h1 =>", $("h1").length);
          console.log("h2 =>", $("h2").length);
          console.log("h3 =>", $("h3").length);
          console.log("h4 =>", $("h4").length);
          console.log("h5 =>", $("h5").length);
          console.log("h6 =>", $("h6").length);

          var numberOfHeadings =
            $("h1").length +
            $("h2").length +
            $("h3").length +
            $("h4").length +
            $("h5").length +
            $("h6").length;
          var h1 = $("h1").length;
          var h2 = $("h2").length;
          var h3 = $("h3").length;
          var h4 = $("h4").length;
          var h5 = $("h5").length;
          var h6 = $("h6").length;

          var title, release, rating;
          var json = { title: "", release: "", rating: "" };

          title = $("title").text();

          var html = cheerio.parseHTML(html)
          // if(html) {
          //   json.html = html;
          // }
          var links = [];
          var externalLinks = [];
          var internalinks = [];
          $("a").each((index, value) => {
            var link = $(value).attr("href");
            console.log("link", link)
            if (
              link &&
              (link.includes(response.request.uri.hostname) ||
              link.startsWith("#") ||
              link.startsWith("/"))
            ) {
              internalinks.push({ link: link });
            } else {
              externalLinks.push({ link: link });
            }
          });

          json.title = title;
          json.numberOfHeadings = numberOfHeadings;

          json.h1 = h1;
          json.h2 = h2;
          json.h3 = h3;
          json.h4 = h4;
          json.h5 = h5;
          json.h6 = h6;
          json.links = links;
          json.internalinks = internalinks;
          json.externalLinks = externalLinks;

        } else {
          console.log("error => ", error);
          let message = "Something went wrong!";
          if(error['code'] === 'ECONNREFUSED' || error['code'] === 'ENOTFOUND') {
            message = "URL is not reachable"
          }
          console.log("here")
          res.status(500).send({...error, message});
        }

        console.log(json);
        res.send(json);
      });
    } else {
      res.status(500).send({ message: "URL missing" });
    }
  } catch (error) {
    console.log("err 12=>",error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

app.get("*", function(req, res) {
  res.status(404).send("Not Found");
});
app.post("*", function(req, res) {
  res.status(404).send("Not Found");
});

app.use(express.static("public", { index: "index.html" }));

console.log("Navigate to http://localhost:8081/");
exports = module.exports = app;
