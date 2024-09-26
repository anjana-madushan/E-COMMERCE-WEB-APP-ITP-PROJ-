let express = require("express"),
  router = express.Router();
let gradeSchema = require("../models/Grade");

// CREATE grade
router.route("/create-grade").post((req, res, next) => {
  gradeSchema.create(req.body, (error, data) => {
    if (error) {
      console.error("Error creating grade:", error);
      return res.status(500).json({ message: "Failed to create grade. Please try again." });
    } else {
      console.log("Grade created:", data);
      return res.status(201).json({ message: "Grade created successfully", data });
    }
  });
});

// READ all grades
router.route("/").get((req, res, next) => {
  gradeSchema.find((error, data) => {
    if (error) {
      console.error("Error fetching grades:", error);
      return res.status(500).json({ message: "Failed to fetch grades. Please try again later." });
    } else {
      return res.status(200).json(data);
    }
  });
});

// Get Single grade
router.route("/edit-grade/:id").get((req, res, next) => {
  gradeSchema.findById(req.params.id, (error, data) => {
    if (error) {
      console.error("Error fetching grade:", error);
      return res.status(500).json({ message: "Failed to fetch grade. Please try again later." });
    } else if (!data) {
      return res.status(404).json({ message: "Grade not found" });
    } else {
      return res.status(200).json(data);
    }
  });
});

// UPDATE grade
router.route("/update-grade/:id").put((req, res, next) => {
  gradeSchema.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }, // Ensures the updated document is returned
    (error, data) => {
      if (error) {
        console.error("Error updating grade:", error);
        return res.status(500).json({ message: "Failed to update grade. Please try again later." });
      } else if (!data) {
        return res.status(404).json({ message: "Grade not found" });
      } else {
        console.log("Grade updated:", data);
        return res.status(200).json({ message: "Grade updated successfully", data });
      }
    }
  );
});

// DELETE grade
router.route("/delete-grade/:id").delete((req, res, next) => {
  gradeSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      console.error("Error deleting grade:", error);
      return res.status(500).json({ message: "Failed to delete grade. Please try again later." });
    } else if (!data) {
      return res.status(404).json({ message: "Grade not found" });
    } else {
      console.log("Grade deleted:", data);
      return res.status(200).json({ message: "Grade deleted successfully", data });
    }
  });
});

module.exports = router;
