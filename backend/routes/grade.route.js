const express = require('express');
const app = express;
const router = new app.Router();

// exam Model
const gradeSchema = require('../models/Grade');

// CREATE exam
router.route('/create-grade').post((req, res, next) => {
  gradeSchema.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

// READ grade
router.route('/').get((req, res, next) => {
  gradeSchema.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      return res.json(data);
    }
  });
});

// Get Single grade
router.route('/edit-grade/:id').get((req, res, next) => {
  gradeSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Update grade
router.route('/update-grade/:id').put((req, res, next) => {
  gradeSchema.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      (error, data) => {
        if (error) {
          return next(error);
        } else {
          res.json(data);
          console.log('grade updated successfully !');
        }
      },
  );
});

// Delete grade
router.route('/delete-grade/:id').delete((req, res, next) => {
  gradeSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

module.exports = router;
