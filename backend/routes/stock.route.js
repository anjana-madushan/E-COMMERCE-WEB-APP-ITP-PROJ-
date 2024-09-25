let express = require('express'),
  router = express.Router();

// exam Model
let stockSchema = require('../models/Stock');

// CREATE exam
router.route('/create-stock').post((req, res, next) => {
  stockSchema.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      console.log(data)
      res.json(data)
    }
  })
});

// READ grade
router.route('/').get((req, res, next) => {
  stockSchema.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get Single grade
router.route('/edit-stock/:id').get((req, res, next) => {
  stockSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update grade
router.route('/update-stock/:id').put((req, res, next) => {
  stockSchema.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
      console.log('stock updated successfully !')
    }
  })
})

// Delete grade
router.route('/delete-stock/:id').delete((req, res, next) => {
  stockSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = router;