const express = require('express');
const router = express.Router();
const Manager = require('../models/manager.model');
const ForgotPassword = require('../models/forgot-password.model');

// GET all managers
router.get('/', async (req, res) => {
  try {
    const managers = await Manager.find();
    res.json(managers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET manager by ID
router.get('/:id', async (req, res) => {
  try {
    const manager = await Manager.findById(req.params.id);
    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }
    res.json(manager);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new manager
router.post('/add', async (req, res) => {
  try {
    const { password, address, phoneNumber, email, activityLog, hiringDate } = req.body;
    const manager = new Manager({ password, address, phoneNumber, email, activityLog, hiringDate });
    await manager.save();
    res.status(201).json(manager);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a manager by ID
router.put('/update/:id', async (req, res) => {
  try {
    const { currentLocation, address, phoneNumber, email, activityLog, hiringDate } = req.body;
    const manager = await Manager.findByIdAndUpdate(
      req.params.id,
      { currentLocation, address, phoneNumber, email, activityLog, hiringDate },
      { new: true }
    );
    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }
    res.json(manager);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a manager by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const manager = await Manager.findByIdAndDelete(req.params.id);
    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.route('/loginEmail').post((req, res) => {
  const { email, password } = req.body;

  Manager.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(400).json('User not found');
      }

      // Check if password is correct
      if (user.password !== password) {
        return res.status(400).json('Incorrect password');
      }

      // Authentication successful
      res.status(200).json({ status: 'ok', type: 'user' });
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/forgot-password').post(async(req, res)=>{
try{
  const { message, username } = req.body;
  const forgotPassword = new ForgotPassword({username, message});
  await forgotPassword.save();
  res.status(201).json(forgotPassword);
}catch(err){
  res.status(500).json({ error: 'Internal server error' });
}
});

module.exports = router;
