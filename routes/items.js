const express = require('express');
const router = express.Router();
const Item = require('../models/item.model');

// GET all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new item
router.post('/add', async (req, res) => {
  try {
    let { id, title, image, price, count, isInterest, category } = req.body;
    price = parseInt(price);
    id = parseInt(id);
    const item = new Item({ id, title, image, price, count, isInterest, category });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an item by ID
router.put('/update/:id', async (req, res) => {
  try {
    const { id, title, image, price, count, isInterest, category } = req.body;
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { id, title, image, price, count, isInterest, category },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an item by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add store to item
router.put('/addStore/:itemId/store/:storeId', async (req, res) => {
  try {
    const { itemId, storeId } = req.params;
    // Find the item by ID
    const item = await Item.findById(itemId);
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    // Find the store by ID
    const store = await Store.findById(storeId);
    if (!store) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }
    // Add the store to the item
    item.stores.push(store);
    const savedItem = await item.save();
    res.json(savedItem);
  } catch (error) {
    console.error('Failed to add store to item:', error);
    res.status(500).json({ error: 'Failed to add store to item' });
  }
});

router.get('/custom/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findOne({ id: itemId });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
