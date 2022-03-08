'use strict';

// Import packages
const express = require('express');
const cors = require('cors')
const os = require('os')
const app = express();

// Route middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ping home route
app.get('/', (req, res) => {
  try {
    return res.status(200).json('Ok');
  } catch (error) {
    return res.status(500).json('Internal Server Error!');
  }
});

// Verify request
app.use('/', require("./routes/auth"));
app.use('/nft', require("./routes/nft"));

// notfound route handler
app.use((req, res, next) => {
  const error = {
    statusText: new Error('Not Found'),
    status: 404
  };
  next(error);
})

// error handler
app.use((error, req, res, next) => {
  res.json({
    message: error.message,
    status: error.status || 500
  });
});

// const network = os.networkInterfaces().en0.find(elm => elm.family=='IPv4').address;
// Set up port and start the server
app.listen( process.env.PORT, () => {
  console.log(`Server running at:`);
  console.log(`- Local: http://localhost:${process.env.PORT}`);
  // console.log(`- Network: http://${network}:${process.env.PORT}`);
});

module.exports = app;
