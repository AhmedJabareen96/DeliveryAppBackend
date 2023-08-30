const express = require('express');
const router = express.Router();
const Deliver = require('../models/deliver.model');

// GET all delivery persons
router.get('/', async (req, res) => {
  try {
    const delivers = await Deliver.find();
    res.json(delivers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET delivery person by ID
router.get('/:id', async (req, res) => {
  try {
    const deliver = await Deliver.findById(req.params.id);
    if (!deliver) {
      return res.status(404).json({ error: 'Delivery person not found' });
    }
    res.json(deliver);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new delivery person
router.post('/add', async (req, res) => {
  console.log("hi");
  try {
    const {
      currentLocation,
      name,
      password,
      address,
      phoneNumber,
      email,
      drivingLicense,
      carType,
      carNumber,
      deliveriesLog,
      subscriptionDate,
      deliveries
    } = req.body;
    const deliver = new Deliver({
      currentLocation,
      name,
      password,
      address,
      phoneNumber,
      email,
      drivingLicense,
      carType,
      carNumber,
      deliveriesLog,
      subscriptionDate,
      deliveries
    });
    await deliver.save();
    res.status(201).json(deliver);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a delivery person by ID
router.put('/update/:id', async (req, res) => {
  try {
    const {
      currentLocation,
      name,
      password,
      address,
      phoneNumber,
      email,
      drivingLicense,
      carType,
      carNumber,
      deliveriesLog,
      subscriptionDate,
      deliveries
    } = req.body;
    console.log(req.body);
    const deliver = await Deliver.findByIdAndUpdate(
      req.params.id,
      {
        currentLocation,
        name,
        password,
        address,
        phoneNumber,
        email,
        drivingLicense,
        carType,
        carNumber,
        deliveriesLog,
        subscriptionDate,
        deliveries
      },
      { new: true }
    );
    if (!deliver) {
      return res.status(404).json({ error: 'Delivery person not found' });
    }
    res.json(deliver);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a delivery person by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deliver = await Deliver.findByIdAndDelete(req.params.id);
    if (!deliver) {
      return res.status(404).json({ error: 'Delivery person not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add delivery to deliver
router.put('/addDelivery/:deliverId/delivery/:deliveryId', async (req, res) => {
  try {
    const { deliverId, deliveryId } = req.params;
    // Find the deliver by ID
    const deliver = await Deliver.findById(deliverId);
    if (!deliver) {
      res.status(404).json({ error: 'Deliver not found' });
      return;
    }
    // Find the delivery by ID
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      res.status(404).json({ error: 'Delivery not found' });
      return;
    }
    // Add the delivery to the deliver
    deliver.deliveries.push(delivery);
    const savedDeliver = await deliver.save();
    res.json(savedDeliver);
  } catch (error) {
    console.error('Failed to add delivery to deliver:', error);
    res.status(500).json({ error: 'Failed to add delivery to deliver' });
  }
});


router.route('/loginEmail').post((req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  Deliver.findOne({ email })
    .then(deliver => {
      if (!deliver) {
        console.log("user not found");
        return res.status(400).json('User not found');
      }

      // Check if password is correct
      if (deliver.password !== password) {
        console.log("incorrect password");
        return res.status(400).json('Incorrect password');
      }

      // Authentication successful
      console.log("success");
      res.status(200).json({ status: 'ok' });
    })
    .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;
