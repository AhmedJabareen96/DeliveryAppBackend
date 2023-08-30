const express = require('express');
const router = express.Router();
const Delivery = require('../models/delivery.model');

// Create a new delivery
router.post('/add', (req, res) => {
  const { clientId, storesAndItems, deliverId } = req.body;

  const newDelivery = new Delivery({
    clientId,
    storesAndItems,
    deliverId
  });

  newDelivery.save()
    .then(delivery => {
      res.status(201).json(delivery);
    })
    .catch(err => {
      res.status(400).json({ error: err.message });
    });
});

// Read all deliveries
router.get('/', (req, res) => {
  Delivery.find()
    .then(deliveries => {
      res.json(deliveries);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Read a specific delivery by ID
router.get('/:id', (req, res) => {
  Delivery.findById(req.params.id)
    .then(delivery => {
      if (!delivery) {
        return res.status(404).json({ error: 'Delivery not found' });
      }
      res.json(delivery);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Update a delivery by ID
router.put('/:id', (req, res) => {
  const { clientId, storesAndItems, deliverId } = req.body;

  Delivery.findByIdAndUpdate(req.params.id, {
    clientId,
    storesAndItems,
    deliverId
  }, { new: true })
    .then(delivery => {
      if (!delivery) {
        return res.status(404).json({ error: 'Delivery not found' });
      }
      res.json(delivery);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Delete a delivery by ID
router.delete('/:id', (req, res) => {
  Delivery.findByIdAndRemove(req.params.id)
    .then(delivery => {
      if (!delivery) {
        return res.status(404).json({ error: 'Delivery not found' });
      }
      res.json({ message: 'Delivery deleted successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
