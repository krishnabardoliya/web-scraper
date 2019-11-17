var express = require("express");
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var app = express();
const cors = require("cors");
var urlPackage = require("url");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.listen("8081");

app.post("/scrape", function(req, res) {
  try {
    // console.log(req.body);
    var url = req.body.url;
    if (url) {
      var start = new Date();
      request(url, function(error, response, html) {
        if (!error) {
          console.log("Request took:", new Date() - start, "ms");

          // console.log("response =>", response);

          var $ = cheerio.load(html);

          // console.log("html =>", html)

          // console.log("h1 =>", $("h1").length);
          // console.log("h2 =>", $("h2").length);
          // console.log("h3 =>", $("h3").length);
          // console.log("h4 =>", $("h4").length);
          // console.log("h5 =>", $("h5").length);
          // console.log("h6 =>", $("h6").length);
          var responseTime = new Date() - start;
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

          // var html = cheerio.parseHTML(html);
          // if(html) {
          //   json.html = html;
          // }
          var links = [];
          var externalLinks = [];
          var internalinks = [];
          var images = [];
          $("a").each((index, value) => {
            var link = $(value).attr("href");
            // console.log("link", link);
            if (link && link !== "" && link !== undefined) {
              if (
                link.includes(response.request.uri.hostname) ||
                link.startsWith("#") ||
                link.startsWith("/")
              ) {
                internalinks.push({ link });
              } else {
                externalLinks.push({ link });
              }
            }
          });

          var currDimension = 0;
          var maxDimension = 0;
          var maxImage = null;

          $("img").each((index, value) => {
            // console.log("value =>", value)
            var image = $(value).attr("data-cfsrc");
            var image_data_src = $(value).attr("data-src");
            var image_src = $(value).attr("src");
            if (image) {
              console.log("image =>", image);
              images.push({image: image});
              currDimension =$(value).attr("width") *$(value).attr("height");
              if (currDimension > maxDimension) {
                maxDimension = currDimension;
                maxImage = image;
              }
            } else if (image_data_src) {
              currDimension = $(value).attr("width") * $(value).attr("height");
              if (currDimension > maxDimension) {
                maxDimension = currDimension;
                maxImage = image_data_src;
              }
              console.log("image =>", image_data_src);
              images.push({image: image_data_src});
            } else if(image_src) {
              currDimension = $(value).attr("width") * $(value).attr("height");
              if (currDimension > maxDimension) {
                maxDimension = currDimension;
                maxImage = image_src;
              }
              console.log("image =>", image_src);
              images.push({image: image_src});
            }
          });


          console.log("maxImage => ", maxImage);
          console.log("maxDimension => ", maxDimension);
          console.log("currDimension => ", currDimension);

          json.responseTime = responseTime;

          json.title = title;
          json.maxImage = maxImage;
          json.numberOfHeadings = numberOfHeadings;

          json.html = html;
          json.h1 = h1;
          json.h2 = h2;
          json.h3 = h3;
          json.h4 = h4;
          json.h5 = h5;
          json.h6 = h6;
          json.links = links;
          json.internalinks = internalinks;
          json.externalLinks = externalLinks;
          json.images = images;
        } else {
          // console.log("error => ", error);
          let message = "Something went wrong!";
          if (
            error["code"] === "ECONNREFUSED" ||
            error["code"] === "ENOTFOUND"
          ) {
            message = "URL is not reachable";
          }
          res.status(500).send({ ...error, message });
        }

        // console.log(json);
        res.send(json);
      });
    } else {
      res.status(500).send({ message: "URL missing" });
    }
  } catch (error) {
    // console.log("err 12=>", error);
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
