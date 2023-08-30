const express = require('express');
const router = express.Router();
const DeliveryItem = require('../models/deliveryItem.model');

// Create a new delivery item
router.post('/add', async (req, res) => {
  try {
    const { items } = req.body;
    const deliveryItem = new DeliveryItem({ items });
    const savedItem = await deliveryItem.save();
    res.json(savedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all delivery items
router.get('/', async (req, res) => {
  try {
    const deliveryItems = await DeliveryItem.find();
    res.json(deliveryItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific delivery item by ID
router.get('/:id', async (req, res) => {
  try {
    const deliveryItem = await DeliveryItem.findById(req.params.id);
    if (!deliveryItem) {
      return res.status(404).json({ message: 'Delivery item not found' });
    }
    res.json(deliveryItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a delivery item by ID
router.put('/:id', async (req, res) => {
  try {
    console.log("update delivery..");
    console.log(req.body);
    const updatedItem = await DeliveryItem.findByIdAndUpdate(
      req.params.id,
      { items: req.body.items},
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Delivery item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a delivery item by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await DeliveryItem.findByIdAndRemove(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Delivery item not found' });
    }
    res.json({ message: 'Delivery item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
