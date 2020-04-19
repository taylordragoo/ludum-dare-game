const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));

// send the user to index html page inspite of the url
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './src/index.html'));
});

app.listen(port);

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/public/404.html"));
  });
  
console.log("App is listening on port " + port);