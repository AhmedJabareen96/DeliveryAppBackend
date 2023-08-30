const express = require('express');
const router = express.Router();

const Category = require('../models/categoty.model');
const Item = require('../models/item.model');

// Create a new category
router.post('/add', async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    const savedCategory = await category.save();
    res.json(savedCategory);
  } catch (error) {
    console.error('Failed to create category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Retrieve all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Failed to retrieve categories:', error);
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
});

// Retrieve a specific category by ID
router.get('/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json(category);
  } catch (error) {
    console.error('Failed to retrieve category:', error);
    res.status(500).json({ error: 'Failed to retrieve category' });
  }
});

// Update a category
router.put('/update/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true }
    );
    if (!updatedCategory) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json(updatedCategory);
  } catch (error) {
    console.error('Failed to update category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete a category
router.delete('/delete/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json(deletedCategory);
  } catch (error) {
    console.error('Failed to delete category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Add an item to a category
router.post('/addItem/:categoryId/items/:itemId', async (req, res) => {
  try {
    const { categoryId, itemId } = req.params;
    const category = await Category.findById(categoryId);
    const item = await Item.findById(itemId);
    if (!category || !item) {
      res.status(404).json({ error: 'Category or item not found' });
      return;
    }
    if (category.items.includes(itemId)) {
      res.status(400).json({ error: 'Item already exists in the category' });
      return;
    }
    category.items.push(itemId);
    const savedCategory = await category.save();
    res.json(savedCategory);
  } catch (error) {
    console.error('Failed to add item to category:', error);
    res.status(500).json({ error: 'Failed to add item to category' });
}
});

// Delete an item from a category
router.delete('/deleteItem/:categoryId/items/:itemId', async (req, res) => {
try {
  const { categoryId, itemId } = req.params;
  const category = await Category.findById(categoryId);
  if (!category) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  const itemIndex = category.items.indexOf(itemId);
  if (itemIndex === -1) {
    res.status(404).json({ error: 'Item not found in the category' });
    return;
  }
  category.items.splice(itemIndex, 1);
  const savedCategory = await category.save();
  res.json(savedCategory);
} catch (error) {
  console.error('Failed to delete item from category:', error);
  res.status(500).json({ error: 'Failed to delete item from category' });
}
});

module.exports = router;

