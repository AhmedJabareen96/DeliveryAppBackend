const router = require('express').Router();
const User = require('../models/user.model');
const ShoppingCart = require('../models/shoppingCart.model');

// Get all users
router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new user
router.route('/add').post((req, res) => {
  const { username, email, password, currentLocation, address, phoneNumber, dateOfSubscription, payingMethod } = req.body;

  User.findOne({ $or: [{ username: username }, { email: email }] }) // Check if username or email already exists
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json('Username or email already exists');
      }

      const newUser = new User({ username, password, currentLocation, address, phoneNumber, email, dateOfSubscription, payingMethod });

      newUser.save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});


// Get user by id
router.route('/getUser/:id').get((req, res) => {
  User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});


// Update user by id
router.route('/update/:id').put((req, res) => {
  User.findById(req.params.id)
    .then(user => {
      user.username = req.body.username;
      user.password = req.body.password;
      user.currentLocation = req.body.currentLocation;
      user.address = req.body.address;
      user.phoneNumber = req.body.phoneNumber;
      user.email = req.body.email;
      user.dateOfSubscription = req.body.dateOfSubscription;
      user.payingMethod = req.body.payingMethod;

      user.save()
        .then(() => res.json('User updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Delete user by id
router.route('/delete/:id').delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json('User deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Route to add an existing shopping cart to a user
router.put('/AddECart/:userId/shoppingCart/:shoppingCartId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const shoppingCartId = req.params.shoppingCartId;

    // Find the user and shopping cart
    const user = await User.findById(userId);
    const shoppingCart = await ShoppingCart.findById(shoppingCartId);

    // Update the user's shoppingCart field with the shopping cart ID
    user.shoppingCart = shoppingCartId;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Route to add a new shopping cart to a user
router.route('/addCart/:id/shopping-cart').put(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let shoppingCart = await ShoppingCart.findOne({ clientID: user._id });
    if (!shoppingCart) {
      shoppingCart = new ShoppingCart({ clientID: user._id });
    } else {
      shoppingCart.itemsIds = [];
    }

    const items = req.body.items || [];
    shoppingCart.itemsIds = items.map(item => item.id);

    await shoppingCart.save();

    user.shoppingCart = shoppingCart._id;
    await user.save();

    return res.json({ message: 'Shopping cart added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.route('/login').post((req, res) => {
  const { username, password } = req.body;

  // Check if username exists
  User.findOne({ username })
    .then(user => {
        console.log(password)
        console.log(username)
      if (!user) {
        return res.status(400).json('Username not found');
      }

      // Check if password is correct
      if (user.password !== password) {
        return res.status(400).json('Incorrect password');
      }

      // Authentication successful
      res.sendStatus(200);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/hello').get((req,res) => {
  res.status(200).json("hello!")
});

router.route('/loginEmail').post((req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
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




module.exports = router;

