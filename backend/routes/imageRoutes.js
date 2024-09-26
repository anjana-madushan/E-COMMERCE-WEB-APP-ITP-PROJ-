const cloudinary = require('cloudinary').v2;
const router = require('express').Router();
require('dotenv').config();

// Configure secure environment variables for Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// DELETE route to remove image from Cloudinary
router.delete('/:public_id', async (req, res) => {
  const { public_id } = req.params;
  
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    
    if (result.result === 'not found') {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (e) {
    console.error('Error deleting image:', e);
    res.status(500).json({ message: 'Failed to delete image. Please try again later.' });
  }
});

module.exports = router;
