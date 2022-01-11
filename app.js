const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const _ = require("lodash");
const moment  = require("moment");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function(req, res){
  res.render("index", {
    city: "City Name",
    temp: "Temp",
    weatherIcon: "Image",
    weatherDesc: "Description",
    time: moment().format('LT'),
    date: moment().format('dddd') + ", " + moment().format('LL')
  });
});

app.post("/", function(req, res){

  const query = req.body.cityName;
  const appKey = "1b2524ed520e1c658ec83fd4b04a8325";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ appKey +"&units=" + unit;
  https.get(url, function(response){

    if (response.statusCode != 200){
      res.write("Oops!, It seems that you didn't entered a valid city name.");
      res.write(" Please Enter a Valid City Name.");
      res.send();
    } else {
      response.on("data", function(data){
        const weatherData = JSON.parse(data);
        const weatherDesc = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const temp = weatherData.main.temp;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        res.render("index", {
          city: _.upperCase(query),
          temp: temp,
          weatherIcon: imageURL,
          weatherDesc: _.startCase(weatherDesc),
          time: moment().format('LT'),
          date: moment().format('dddd') + ", " + moment().format('LL')
        });
      });
    }
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is Started");
});
