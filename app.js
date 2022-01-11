const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const _ = require("lodash");
const moment  = require("moment");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

const dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

const timeOptions = {
  hour: '2-digit',
  minute: '2-digit'
};

let query = "City Name";
let weatherDesc = "Description";
let temp = "Temp";
let imageURL = "";

app.get("/", function(req, res){

  const raw_today = new Date();
  const today = convertTZ(raw_today, "Asia/Kolkata");
  const date = today.toLocaleDateString("en-US", dateOptions);
  const time = today.toLocaleTimeString("en-US", timeOptions);

  res.render("index", {
    city: _.upperCase(query),
    temp: temp,
    weatherIcon: imageURL,
    weatherDesc: _.startCase(weatherDesc),
    time: time,
    date: date
  });
});

app.post("/", function(req, res){

  query = req.body.cityName;
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
        weatherDesc = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        temp = weatherData.main.temp;
        imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        res.redirect("/");

        // res.render("index", {
        //   city: _.upperCase(query),
        //   temp: temp,
        //   weatherIcon: imageURL,
        //   weatherDesc: _.startCase(weatherDesc),
        //   time: moment().format('LT'),
        //   date: moment().format('dddd') + ", " + moment().format('LL')
        // });
      });
    }
  });
});

function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));
}

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is Started");
});
