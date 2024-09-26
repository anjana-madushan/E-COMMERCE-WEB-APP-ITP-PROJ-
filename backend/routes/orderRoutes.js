const router = require('express').Router();
const Order = require('../models/Order');
const User = require('../models/User');

// Creating an order
router.post('/', async (req, res) => {
  const io = req.app.get('socketio');
  const { userId, cart, country, address } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const order = await Order.create({ owner: user._id, products: cart, country, address });
    order.count = cart.count;
    order.total = cart.total;
    await order.save();

    // Reset user's cart
    user.cart = { total: 0, count: 0 };
    user.orders.push(order);
    const notification = { status: 'unread', message: `New order from ${user.name}`, time: new Date() };
    
    io.sockets.emit('new-order', notification);

    user.markModified('orders');
    await user.save();

    return res.status(201).json({ message: 'Order created successfully', user });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Failed to create order. Please try again later.' });
  }
});

// Getting all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('owner', ['email', 'name']);
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Failed to retrieve orders. Please try again later.' });
  }
});

// Shipping an order
router.patch('/:id/mark-shipped', async (req, res) => {
  const io = req.app.get('socketio');
  const { ownerId } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(ownerId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const order = await Order.findByIdAndUpdate(id, { status: 'shipped' }, { new: true });
    if (!order) {
      return res.status(404).json({ message: `Order with ID ${id} not found` });
    }

    const orders = await Order.find().populate('owner', ['email', 'name']);
    const notification = { status: 'unread', message: `Order ${id} shipped successfully`, time: new Date() };

    io.sockets.emit("notification", notification, ownerId);

    user.notifications.push(notification);
    await user.save();

    return res.status(200).json({ message: 'Order marked as shipped', orders });
  } catch (error) {
    console.error('Error marking order as shipped:', error);
    return res.status(500).json({ message: 'Failed to mark order as shipped. Please try again later.' });
  }
});

module.exports = router;
