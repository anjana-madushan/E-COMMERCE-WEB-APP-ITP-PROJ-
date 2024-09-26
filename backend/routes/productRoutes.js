const router = require('express').Router();
const Product = require('../models/Product');
const User = require('../models/User');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products. Please try again later.' });
  }
});

// Create a product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, images: pictures } = req.body;
    const product = await Product.create({ name, description, price, category, pictures });
    const products = await Product.find();
    res.status(201).json(products);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product. Please try again later.' });
  }
});

// Update a product
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { name, description, price, category, images: pictures } = req.body;
    const product = await Product.findByIdAndUpdate(id, { name, description, price, category, pictures }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product. Please try again later.' });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    const user = await User.findById(user_id);
    if (!user || !user.isAdmin) return res.status(403).json({ message: "You don't have permission to delete this product" });

    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product. Please try again later.' });
  }
});

// Get a specific product
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const similar = await Product.find({ category: product.category }).limit(5);
    res.status(200).json({ product, similar });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product. Please try again later.' });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    let products;
    if (category === "all") {
      products = await Product.find().sort([['date', -1]]);
    } else {
      products = await Product.find({ category });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Failed to fetch products by category. Please try again later.' });
  }
});

// Cart Routes

// Add to cart
router.post('/add-to-cart', async (req, res) => {
  const { userId, productId, price } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userCart = user.cart || { total: 0, count: 0 };
    if (userCart[productId]) {
      userCart[productId] += 1;
    } else {
      userCart[productId] = 1;
    }
    userCart.count += 1;
    userCart.total = Number(userCart.total) + Number(price);

    user.cart = userCart;
    user.markModified('cart');
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Failed to add product to cart. Please try again later.' });
  }
});

// Increase cart quantity
router.post('/increase-cart', async (req, res) => {
  const { userId, productId, price } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userCart = user.cart;
    userCart.total += Number(price);
    userCart.count += 1;
    userCart[productId] += 1;

    user.cart = userCart;
    user.markModified('cart');
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error increasing cart quantity:', error);
    res.status(500).json({ message: 'Failed to increase product quantity. Please try again later.' });
  }
});

// Decrease cart quantity
router.post('/decrease-cart', async (req, res) => {
  const { userId, productId, price } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userCart = user.cart;
    userCart.total -= Number(price);
    userCart.count -= 1;
    userCart[productId] -= 1;

    if (userCart[productId] <= 0) {
      delete userCart[productId];
    }

    user.cart = userCart;
    user.markModified('cart');
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error decreasing cart quantity:', error);
    res.status(500).json({ message: 'Failed to decrease product quantity. Please try again later.' });
  }
});

// Remove from cart
router.post('/remove-from-cart', async (req, res) => {
  const { userId, productId, price } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userCart = user.cart;
    userCart.total -= Number(userCart[productId]) * Number(price);
    userCart.count -= userCart[productId];
    delete userCart[productId];

    user.cart = userCart;
    user.markModified('cart');
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Failed to remove product from cart. Please try again later.' });
  }
});

module.exports = router;
