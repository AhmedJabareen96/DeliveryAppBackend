const express = require('express');
const router = express.Router();
const Store = require('../models/store.model');

// GET all stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET store by ID
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new store
router.post('/add', async (req, res) => {
  try {
    console.log(req.body);
    let { name, address, workingHours, lat, lng, items} = req.body;
    items  = items.split(",").map(Number);
    const store = new Store({ name, address, workingHours, lat, lng, items });
    await store.save();
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a store by ID
router.put('/update/:id', async (req, res) => {
  try {
    const { name, address, workingHours, lat, lng, items} = req.body;
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { name, address, workingHours, lat, lng, items},
      { new: true }
    );
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a store by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add an item to a store
router.post('/addItem/:storeId/items/:itemId', async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    store.items.push(req.params.itemId);
    await store.save();
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
