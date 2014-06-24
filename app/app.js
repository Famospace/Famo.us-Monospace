var express = require('express');
var app = express();
var port = process.env.Port || 9000;


app.listen(port);



app.use('/app', express.static(__dirname + '/app'));



app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/lib/*', function (req, res) {
  res.sendfile(__dirname + req.url);
});

app.get('/src/*', function (req, res) {
  res.sendfile(__dirname + req.url);
});

app.get('/styles/*', function (req, res) {
  res.sendfile(__dirname + req.url);
});

app.get('/content/*', function (req, res) {
  res.sendfile(__dirname + req.url);
});

console.log('Live on port 9000');