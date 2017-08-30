const request = require('request');

//9622bd087b91ee40bfa70493acee217a
var getWeather = (lat, lng, callback) => {
    request({
        url: `https://api.darksky.net/forecast/9622bd087b91ee40bfa70493acee217a/${lat},${lng}`,
        json: true
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            callback(undefined, {
                temperature: body.currently.temperature,
                apparentTemperature: body.currently.apparentTemperature
            });
        } else {
            callback('Unable to fetch weather');
        }
    });
};

module.exports.getWeather = getWeather;