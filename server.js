const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const axios = require('axios');
const path = require('path');
const http = require('http');

const app = express()

const port = process.env.PORT || 3000;

const apiKey = '****';


app.set('port', port);
app.set('view engine', 'ejs')
app.set(express.static('views'));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.get('/', function (req, res) {
    res.render('index', {
        weather: null,
        error: null
    });
})

app.post('/', function (req, res) {
    //    console.log(req.body.city);
    var city = req.body.city;
    var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}`;

    axios.get(geocodeUrl).then((response) => {
        if (response.data.status === 'ZERO_RESULTS') {
            res.render('index', {
                weather: 'null',
                error: 'Unable to retrieve the Weather.\n Please try again.'
            });
            // throw new Error('Unable to find the address');
        }
        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;
        console.log(lat + ',' + lng);
        var weatherUrl = `https://api.darksky.net/forecast/9622bd087b91ee40bfa70493acee217a/${lat},${lng}`;

        console.log(response.data.results[0].formatted_address);
        return axios.get(weatherUrl);
    }).then((response) => {
        var temperature = response.data.currently.temperature;
        var apparentTemperature = response.data.currently.apparentTemperature;
        var windSpeed = response.data.currently.windSpeed;
        var humidity = response.data.currently.humidity;
        var summary = response.data.currently.summary;
        var weatherText = `It's currently ${temperature} degrees. It feels like ${apparentTemperature} degrees`;
        res.render('index', {
            weather: weatherText,
            humidity,
            windSpeed,
            summary,
            error: null
        });
    }).catch((e) => {
        if (e.code === 'ENOTFOUND') {
            res.render('index', {
                weather: null,
                error: 'Error, please try again'
            });
        }
    });
})
app.listen(port, function () {
    console.log(`App is listening on port ${port}!`)
})

module.exports = app;