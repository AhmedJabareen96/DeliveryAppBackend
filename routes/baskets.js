const express = require('express');
const router = express.Router();
const Basket = require('../models/basket.model');
const Store = require('../models/store.model');
const { createDelivery } = require('../graph-builder/createDelivery');


// Create a new basket
router.post('/add', (req, res) => {
  const { username, itemIds } = req.body;
  const newBasket = new Basket({ username, itemIds });

  newBasket.save()
    .then(savedBasket => {
      res.json(savedBasket);
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
});

// Get all baskets
router.get('/', (req, res) => {
  Basket.find()
    .then(baskets => {
      res.json(baskets);
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
});


// Get a specific basket by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Basket.findById(id)
    .then(basket => {
      if (!basket) {
        throw new Error('Basket not found');
      }
      res.json(basket);
    })
    .catch(error => {
      res.status(404).json({ error: error.message });
    });
});

// Update a basket by ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { username, itemIds } = req.body;

  Basket.findByIdAndUpdate(id, { username, itemIds }, { new: true })
    .then(updatedBasket => {
      if (!updatedBasket) {
        throw new Error('Basket not found');
      }
      res.json(updatedBasket);
    })
    .catch(error => {
      res.status(404).json({ error: error.message });
    });
});

// Delete a basket by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Basket.findByIdAndDelete(id)
    .then(deletedBasket => {
      if (!deletedBasket) {
        throw new Error('Basket not found');
      }
      res.json({ message: 'Basket deleted successfully' });
    })
    .catch(error => {
      res.status(404).json({ error: error.message });
    });
});

router.post("/addDelivery", async (req, res) => {
  
  const username = req.body.username;
  const items = req.body.items;
  const lat = req.body.lat;
  const lng = req.body.lng;
  const totalPrice = req.body.totalPrice;
  let items_obj = {};

  items.forEach((item) => {
    if (items_obj[item]) {
      items_obj[item]++;
    } else {
      items_obj[item] = 1;
    }
  });

  const user_location = {
    lat: lat,
    lng: lng
  };

  const startingPoint = {storeId: "driver1", lat: parseFloat(user_location.lat), lng: parseFloat(user_location.lng) };


  try {
    const _basket = new Basket({username, items_obj, user_location, totalPrice});
    console.log(username);
    console.log(items_obj);
    console.log(startingPoint);
    console.log(totalPrice);
    const createDeliveryForUser = await createDelivery(username, items_obj, startingPoint, totalPrice);
    // await _basket.save();
    res.status(201).json({message: "ok"});
  } catch(error){
    res.status(500).json({ error: 'Internal server error' });
  }
  
  // Find all stores with the specified item ID

  // create the delivery item

  // save the delivery item 

})


module.exports = router;
