const router = require("express").Router();
const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");
const User = require("../models/User");

// Get all feedbacks
router.get("/getallfeedbacks", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("user");
    if (!feedbacks || feedbacks.length === 0) {
      return res.status(404).json({ message: "No feedbacks found" });
    }
    return res.status(200).json({ feedbacks });
  } catch (err) {
    console.error("Error fetching feedbacks:", err);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Report feedbacks by date
router.get("/report/:date", async (req, res) => {
  const { date } = req.params;
  try {
    const feedbacks = await Feedback.find({ createdAt: date });
    if (!feedbacks || feedbacks.length === 0) {
      return res.status(404).json({ message: "No feedbacks found for the given date" });
    }
    return res.status(200).json({ feedbacks });
  } catch (err) {
    console.error("Error fetching feedbacks by date:", err);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Add feedback
router.post("/addFeedback", async (req, res) => {
  const { title, description, image, user } = req.body;

  try {
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(400).json({ message: "User not found with the provided ID" });
    }

    const feedback = new Feedback({ title, description, image, user });
    const session = await mongoose.startSession();
    session.startTransaction();
    
    await feedback.save({ session });
    existingUser.feedbacks.push(feedback);
    await existingUser.save({ session });
    await session.commitTransaction();

    return res.status(201).json({ message: "Feedback created successfully", feedback });
  } catch (err) {
    console.error("Error adding feedback:", err);
    return res.status(500).json({ message: "Server error. Could not add feedback. Please try again later." });
  }
});

// Update feedback
router.put("/updateFeedback/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, image, user } = req.body;

  try {
    const feedback = await Feedback.findByIdAndUpdate(id, { title, description, image, user }, { new: true });
    if (!feedback) {
      return res.status(404).json({ message: `Feedback with ID ${id} not found` });
    }
    return res.status(200).json({ message: "Feedback updated successfully", feedback });
  } catch (err) {
    console.error("Error updating feedback:", err);
    return res.status(500).json({ message: "Server error. Could not update feedback. Please try again later." });
  }
});

// Delete feedback
router.delete("/deleteFeedback/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const feedback = await Feedback.findByIdAndRemove(id).populate("user");
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    await feedback.user.feedbacks.pull(feedback);
    await feedback.user.save();
    
    return res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (err) {
    console.error("Error deleting feedback:", err);
    return res.status(500).json({ message: "Server error. Could not delete feedback. Please try again later." });
  }
});

// Get feedbacks for a user
router.get("/fuser/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const userFeedbacks = await Feedback.find({ user: id });
    if (!userFeedbacks || userFeedbacks.length === 0) {
      return res.status(404).json({ message: "No feedbacks found for this user" });
    }
    return res.status(200).json({ feedbacks: userFeedbacks });
  } catch (err) {
    console.error("Error fetching feedbacks for user:", err);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
