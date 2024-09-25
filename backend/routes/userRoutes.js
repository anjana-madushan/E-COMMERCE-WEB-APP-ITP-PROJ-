const router = require('express').Router();
const User = require('../models/User');

//get user
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).populate('orders');
    res.json(users);
  } catch (e) {
    res.status(400).send(e.message);
  }
})
module.exports = router;

//get a user
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const users = await User.findById(id);
    res.json(users);
  } catch (e) {
    res.status(400).send(e.message);
  }
})
module.exports = router;

// get user orders
router.get('/:id/orders', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate('orders');
    res.json(user.orders);
  } catch (e) {
    res.status(400).send(e.message);
  }
})

// update user notifcations
router.post('/:id/updateNotifications', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    user.notifications.forEach((notif) => {
      notif.status = "read"
    });
    user.markModified('notifications');
    await user.save();
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e.message)
  }
})

module.exports = router;