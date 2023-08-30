const express = require('express');
const router = express.Router();
const ShoppingCart = require('../models/shoppingCart.model');

// GET shopping cart by user ID
router.get('/:userId', async (req, res) => {
  try {
    const shoppingCart = await ShoppingCart.findOne({ user: req.params.userId })
      .populate('items')
      .populate('user');
    if (!shoppingCart) {
      return res.status(404).json({ error: 'Shopping cart not found' });
    }
    res.json(shoppingCart);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new shopping cart
router.post('/add', async (req, res) => {
  try {
    const { items, user } = req.body;
    const shoppingCart = new ShoppingCart({ items, user });
    await shoppingCart.save();
    res.status(201).json(shoppingCart);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a shopping cart by user ID
router.put('/update/:userId', async (req, res) => {
  try {
    const { items } = req.body;
    const shoppingCart = await ShoppingCart.findOneAndUpdate(
      { user: req.params.userId },
      { items },
      { new: true }
    )
      .populate('items')
      .populate('user');
    if (!shoppingCart) {
      return res.status(404).json({ error: 'Shopping cart not found' });
    }
    res.json(shoppingCart);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a shopping cart by user ID
router.delete('/delete/:userId', async (req, res) => {
  try {
    const shoppingCart = await ShoppingCart.findOneAndDelete({ user: req.params.userId })
      .populate('items')
      .populate('user');
    if (!shoppingCart) {
      return res.status(404).json({ error: 'Shopping cart not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// add items to shopping cart
router.post('/addItems/items', async (req, res) => {
  try {
    const { itemIds } = req.body;
    // Validate itemIds
    if (!Array.isArray(itemIds)) {
      res.status(400).json({ error: 'Invalid itemIds. Expected an array.' });
      return;
    }
    // Find the shopping cart by user ID (assuming you have a user ID available in the request)
    const userId = req.user.id; // Update this line with the actual user ID retrieval logic
    const shoppingCart = await ShoppingCart.findOne({ user: userId });
    if (!shoppingCart) {
      res.status(404).json({ error: 'Shopping cart not found' });
      return;
    }
    // Add the items to the shopping cart
    shoppingCart.items.push(...itemIds);
    const savedShoppingCart = await shoppingCart.save();
    res.json(savedShoppingCart);
  } catch (error) {
    console.error('Failed to add items to shopping cart:', error);
    res.status(500).json({ error: 'Failed to add items to shopping cart' });
  }
});

module.exports = router;
