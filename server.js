var express = require('express');
var request = require('request');

var app = express();
var port = process.env.PORT || 8060;

app.get('/', function (req, res) {
  request.post('https://www.google.com/recaptcha/api/siteverify', {
    qs: {
      secret: '6LeZSAsUAAAAANGMs9vrtw-r91r1Eo_aslNaRhuE',
      response: req.params.recaptchaResponse,
    }
  }).pipe(res);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}!`);
});
