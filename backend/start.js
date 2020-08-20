const express = require('express');
const cors = require('cors');
const services = require('./services');
// const db = require("./db.js");
//const scheduler = require("./scheduler.js");

const app = express();
const port = 6001;

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

//scheduler.init()

app.get('/api/hello', cors(corsOptions), (req, res) => {
  try {
    // services.run();
    console.log("Got request");
    res.json({message: "Hello"});
    console.log("Sent response");
  }
  catch (error) {
    console.log("Sent response");
    res.status(404).send("Invalid request");
  }
})

app.get('/api/startTest', cors(corsOptions), (req, res) => {
  try {
    services.runDemo();
    res.json({message: "Started"});
  }
  catch (error) {
    console.log(error);
    res.status(404).send("Invalid request");
  }
})

app.get('/api/stopTest', cors(corsOptions), (req, res) => {
  try {
    services.stopDemo();
    res.json({message: "Stopped"});
  }
  catch (error) {
    console.log(error);
    res.status(404).send("Invalid request");
  }
})

// app.get('/schedule', (req, res) => {
//   try {
//     services.run()
//     res.status(200).send(result)
//   }
//   catch (error) {
//     res.status(404).send("Invalid request")
//   }
// })

app.listen(port, () => console.log(`jetson-sprinkler backend listening at http://localhost:${port}`));
