let express = require('express'),
  router = express.Router();

// stock Model
let stockSchema = require('../models/Stock');

// CREATE stock
router.post('/create-stock', (req, res) => {
  stockSchema.create(req.body, (error, data) => {
    if (error) {
      console.error('Error creating stock:', error);
      return res.status(500).json({ message: 'Failed to create stock. Please try again later.' });
    } else {
      console.log('Stock created:', data);
      res.status(201).json({ message: 'Stock created successfully', data });
    }
  });
});

// READ all stocks
router.get('/', (req, res) => {
  stockSchema.find((error, data) => {
    if (error) {
      console.error('Error fetching stocks:', error);
      return res.status(500).json({ message: 'Failed to fetch stocks. Please try again later.' });
    } else {
      res.status(200).json(data);
    }
  });
});

// Get Single stock
router.get('/edit-stock/:id', (req, res) => {
  stockSchema.findById(req.params.id, (error, data) => {
    if (error) {
      console.error('Error fetching stock:', error);
      return res.status(500).json({ message: 'Failed to fetch stock. Please try again later.' });
    } else if (!data) {
      return res.status(404).json({ message: 'Stock not found' });
    } else {
      res.status(200).json(data);
    }
  });
});

// UPDATE stock
router.put('/update-stock/:id', (req, res) => {
  stockSchema.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (error, data) => {
    if (error) {
      console.error('Error updating stock:', error);
      return res.status(500).json({ message: 'Failed to update stock. Please try again later.' });
    } else if (!data) {
      return res.status(404).json({ message: 'Stock not found' });
    } else {
      console.log('Stock updated:', data);
      res.status(200).json({ message: 'Stock updated successfully', data });
    }
  });
});

// DELETE stock
router.delete('/delete-stock/:id', (req, res) => {
  stockSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      console.error('Error deleting stock:', error);
      return res.status(500).json({ message: 'Failed to delete stock. Please try again later.' });
    } else if (!data) {
      return res.status(404).json({ message: 'Stock not found' });
    } else {
      res.status(200).json({ message: 'Stock deleted successfully', data });
    }
  });
});

module.exports = router;
