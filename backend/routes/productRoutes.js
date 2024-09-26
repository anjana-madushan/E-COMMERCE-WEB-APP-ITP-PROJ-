const router = require('express').Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
// const { scanImageWithVirusTotal } = require('../configs/virusTotal');
const { validateProductInput } = require('../validations/validations')
const { sanitizeProductInput } = require('../validations/sanitization')

require('dotenv').config();
//get products;
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (e) {
    console.error(e)
    return res.status(400).send(e.message);
  }
})

//create product
router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    validateProductInput(req.body);
    const sanitizedInput = sanitizeProductInput(req.body);

    const { name, description, price, category, images: pictures } = sanitizedInput
    const product = await Product.create({ name, description, price, category, pictures });

    const products = await Product.find();
    res.status(201).json(products);
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

// update product
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    validateProductInput(req.body);
    const sanitizedInput = sanitizeProductInput(req.body);
    const { name, description, price, category, pictures } = sanitizedInput
    const product = await Product.findByIdAndUpdate(id, { name, description, price, category, pictures }, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (e) {
    res.status(400).json({ message: 'An error occurred while updating the product' });
  }
})


// delete product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    const user = await User.findById(user_id);
    if (!user.isAdmin) return res.status(401).json("You don't have permission");
    await Product.findByIdAndDelete(id);
    const products = await Product.find();
    res.status(200).json(products);
  } catch (e) {
    res.status(400).send(e.message);
  }
})

//get specific product
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const similar = await Product.find({ category: product.category }).limit(5);
    res.status(200).json({ product, similar })
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    let products;

    if (category === "all") {
      products = await Product.find().sort([['date', -1]]);
    } else {
      products = await Product.find({ category })
    }
    res.status(200).json(products)
  } catch (e) {
    console.error(e);
    return res.status(400).send({ message: 'Internal server error' });
  }
})


// cart routes
router.post('/add-to-cart', async (req, res) => {
  const { userId, productId, price } = req.body;

  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    if (user.cart[productId]) {
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
  } catch (e) {
    res.status(400).send(e.message);
  }
})

router.post('/increase-cart', async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    userCart.total += Number(price);
    userCart.count += 1;
    userCart[productId] += 1;
    user.cart = userCart;
    user.markModified('cart');
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/decrease-cart', async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    userCart.total -= Number(price);
    userCart.count -= 1;
    userCart[productId] -= 1;
    user.cart = userCart;
    user.markModified('cart');
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/remove-from-cart', async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    userCart.total -= Number(userCart[productId]) * Number(price);
    userCart.count -= userCart[productId];
    delete userCart[productId];
    user.cart = userCart;
    user.markModified('cart');
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
})

module.exports = router;