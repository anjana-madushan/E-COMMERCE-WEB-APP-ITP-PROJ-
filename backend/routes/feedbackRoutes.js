const router = require("express").Router();
const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");
const User = require("../models/User");
var axios = require("axios");
const { ScanUrl } = require("../configs/virusTotal")

//get all feedbacks
router.get("/getallfeedbacks", async (req, res) => {
  let feedbacks;
  try {
    feedbacks = await Feedback.find().populate("user");
  } catch (err) {
    return console.log(err);
  }
  if (!feedbacks) {
    return res.status(404).json({ message: "No Feedbacks Found" });
  }
  return res.status(200).json({ feedbacks });
});

//Report
router.get("/report/:date", async (req, res) => {
  let feedbacks;
  const { date } = req.params;
  try {
    feedbacks = await Feedback.find({ createdAt: date });
  } catch (err) {
    return console.log(err);
  }
  if (!feedbacks) {
    return res.status(404).json({ message: "No Feedbacks Found" });
  }
  return res.status(200).json({ feedbacks });
});

//addFeedbacks
router.post("/addFeedback", async (req, res) => {
  const { title, description, image, user } = req.body;

  const imageUrl = image;
  console.log(imageUrl);

  // Await the ScanUrl function to check the image URL
  let isSafe;
  try {
    isSafe = await ScanUrl(imageUrl); // Use await to handle the promise
  } catch (error) {
    console.error('Error during URL scanning:', error);
    return res.status(500).json({ message: 'Error scanning the image URL' });
  }
  if (!isSafe) {
    console.log('Unsafe image detected');
    return res.status(400).json({ message: `Image ${imageUrl} is unsafe.` });
  }

  let existingUser;
  try {
    existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(400).json({ message: "Unable to find user by this ID" });
    }
  } catch (err) {
    console.error('Error finding user:', err);
    return res.status(500).json({ message: 'Error retrieving user' });
  }

  const feedback = new Feedback({
    title,
    description,
    image,
    user,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await feedback.save({ session });
    existingUser.feedbacks.push(feedback);
    await existingUser.save({ session });

    await session.commitTransaction();
    return res.status(200).json({ feedback });
  } catch (err) {
    console.error('Error saving feedback:', err);
    return res.status(500).json({ message: err.message });
  }
});

//Update feedback
router.put("/updateFeedback/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, image, user } = req.body;
  let feedback;
  try {
    feedback = await Feedback.findByIdAndUpdate(id, {
      title,
      description,
      image,
      user,
    });
  } catch (err) {
    return console.log(err);
  }
  if (!feedback) {
    return res.status(500).json({ message: "Unable To Update Feedback" + id });
  }
  return res.status(200).json({ feedback });
});

//Delete feedback
router.delete("/deleteFeedback/:id", async (req, res) => {
  const { id } = req.params;
  let feedback;
  try {
    feedback = await Feedback.findByIdAndRemove(id).populate("user");
    await feedback.user.feedbacks.pull(feedback);
    await feedback.user.save();
  } catch (err) {
    console.log(err);
  }
  if (!feedback) {
    return res.status(500).json({ message: "Unable To Delete" });
  }

  return res.status(200).json({ message: "Successfull Delete" });
});

//Get a user feedback
router.get("/fuser/:id", async (req, res) => {
  const userId = req.params.id;
  let userFeedbacks;
  try {
    userFeedbacks = await Feedback.find({ user: userId });
  } catch (err) {
    return console.log(err);
  }
  if (!userFeedbacks) {
    return res.status(404).json({ message: "No Feedback Found" });
  }
  return res.status(200).json({ user: userFeedbacks });
});

module.exports = router;
