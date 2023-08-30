const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');

// Create a new order
router.post('/add', async (req, res) => {
  try {
    const { clientId, items, deliverId } = req.body;
    const order = new Order({
      clientId,
      items,
      deliverId,
      price
    });
    const savedOrder = await order.save();
    res.json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create an order' });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get a specific order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the order' });
  }
});

// Update an order by ID
router.put('/:id', async (req, res) => {
  try {
    const { clientId, items, deliverId } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { clientId, items, deliverId, price },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the order' });
  }
});

// Delete an order by ID
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the order' });
  }
});

module.exports = router;
