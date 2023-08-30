const express = require('express');
const router = express.Router();
const { createTerminalNode } = require('../graph-builder/SteinerTreeIterated');


router.get('/', (req, res) => {
    createTerminalNode()
      .then(result => {
        console.log("Success:", result);
        res.send(result); // Send a response to the client if needed
      })
      .catch(error => {
        console.error("Error:", error);
        res.status(500).send("Error"); // Send an error response to the client if needed
      });
  });

  module.exports = router;