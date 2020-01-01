//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.post("/", (req, res) => {
  var w = req.body.word;
  var options = {
    url: "https://od-api.oxforddictionaries.com/api/v2/entries/en-us/" + w,
    method: "GET",
    headers: {
      app_id: "YOUR_OXFORD_APP_ID ",
      app_key: "YOUR_OXFORD_APP_KEY"
    }
  };

  request(options, function(error, response, body) {
    console.log(res.statusCode);

    if (error) {
      console.log("Error fetching the api");
    } else {
      if (res.statusCode === 200) {
        var data = JSON.parse(body);
        var results = data.results;
        var str;
        var infos = [];

        if (typeof results === "undefined") {
          res.render("results", {
            infos: {
              empty: true,
              type: "nothing",
              domain: "nothing",
              meaning: "nothing",
              example: "nothing",
              pronunciation: "nothing"
            }
          });
        } else {
          results.forEach(result => {
            var meaning = getSafe(
              () =>
                result.lexicalEntries[0].entries[0].senses[0].definitions[0],
              "nothing"
            );

            var domain = getSafe(
              () =>
                result.lexicalEntries[0].entries[0].senses[0].domains[0].text,
              "nothing"
            );
            console.log(domain);
            var type = getSafe(
              () => result.lexicalEntries[0].lexicalCategory.text,
              "nothing"
            );

            var pronunciation = getSafe(
              () => result.lexicalEntries[0].pronunciations[1].audioFile,
              "nothing"
            );

            var example = getSafe(
              () =>
                result.lexicalEntries[0].entries[0].senses[0].examples[0].text,
              "nothing"
            );

            infos.push({
              type: type,
              domain: domain,
              meaning: meaning,
              example: example,
              pronunciation: pronunciation
            });
          });

          res.render("results", { infos: infos });
        }
      }
    }
  });
});

app.get("/", (req, res) => {
  res.render("main");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("server running on port 3000");
});

function getSafe(fn, defaultVal) {
  try {
    return fn();
  } catch (e) {
    return defaultVal;
  }
}
