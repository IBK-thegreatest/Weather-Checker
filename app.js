//jshint esversion:6

//Setting up the express server
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connecting with the HTML file
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


//get the relevant data from the open weather API and posting the response
app.post('/', function(req, res){
    const cityName = req.body.cityName;
    const unit = 'metric';
    const appId = "6680e4ce52ab7a011eedbc7f00db5d88";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + appId +"&units=" + unit;
    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const description = weatherData.weather[0].description;
            const temperature = weatherData.main.temp;
            const icon = weatherData.weather[0].icon;
            const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            
            res.write("<p>The weather is currently full of " + description + "</p>");
            res.write("<h1>The temperature in " + cityName + " right now is " + temperature + " degrees Celsius</h1>");
            res.write("<img src=" + iconURL + ">");
            res.send()
        })
    });

})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is currently running on port 3000");
});