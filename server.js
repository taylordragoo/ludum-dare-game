const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

// the __dirname is the current directory from where the script is running
app.use('/', express.static(__dirname + '/dist'))

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, './dist/index.html'))
})

app.listen(port);
console.log("App is listening on port " + port);