const express = require('express');
const {buildGraph} = require('../graph-builder/graphBuilder');
const axios = require('axios'); // Import the axios library
const router = express.Router();
const Graph = require('../models/graph.model');
const { route } = require('./terminalNodes');
const {findIteratedSteinerTree, createTerminalNode} = require('../graph-builder/SteinerTreeIterated');
const { createDelivery } = require('../graph-builder/createDelivery');

router.post('/build', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/stores');
    const stores = response.data; 

    const points = stores.map((store) => {
      return {
        storeId: store._id,
        lat: parseFloat(store.lat),
        lng: parseFloat(store.lng),
      };
    });
    console.log(points);
    const graph = await buildGraph(points);
    console.log(graph);
    // save into database
    await Graph.deleteMany({}); // delete existing data
    await Graph.insertMany(graph);
    res.status(200).json(graph);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


router.get('/stree-iterated', async(req, res) => {
    console.log('Route /stree-iterated accessed');

  try {
        console.log(req.body.email);
        console.log(req.body.basket);
        console.log(req.body.startingPoint);
        console.log("entering create delivery")
        const delivery = await createDelivery(req.body.email, req.body.basket, req.body.startingPoint, req.body.price);
        res.status(200).json("ok");
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
  
  });



  router.get('/stree-test', async (req, res) => {
    try {
      const startingPoint = { storeId: 'driver1', lat: 32.58253828588268, lng: 35.18717070984372 };
      const terminals = await createTerminalNode(req.body.items);
      console.log(terminals);
      const graph = await Graph.find();
      const SteinerTree = await findIteratedSteinerTree(graph, terminals, startingPoint);
      console.log(SteinerTree);
      res.status(200).json("ok");

    } catch (err){
      res.status(500).json({error: err});
    }
  });
module.exports = router;