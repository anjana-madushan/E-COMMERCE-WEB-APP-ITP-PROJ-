const cloudinary = require('cloudinary');
const router = require('express').Router();
require('dotenv').config();

// TODO: @Anjana - Configure secure environment variables for Cloudinary
cloudinary.config({
  cloud_name:  "dvcfip5fe",
  api_key:  "533411778726318",
  api_secret:"T8fEINJkTuTgW8YGj4o8Hh8ziyQ"  
})

router.delete('/:public_id', async(req, res)=> {
  const {public_id} = req.params;
  try {
      await cloudinary.uploader.destroy(public_id);
      res.status(200).send();
  } catch (e) {
      res.status(400).send(e.message)
  }
})


module.exports = router;