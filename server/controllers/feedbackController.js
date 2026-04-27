const Feedback = require('../models/feedback.model');

exports.saveFeedback = async (req, res) => {
  try {
    const { role, averageScore, feedback } = req.body;
    const userId = req.user?._id; // From auth middleware

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (typeof averageScore !== 'number' || Number.isNaN(averageScore)) {
      return res.status(400).json({ message: 'averageScore must be a valid number.' });
    }

    // Save feedback with user reference
    const savedFeedback = await Feedback.create({
      user: userId,
      role: role || 'Unknown',
      averageScore,
      feedback: feedback || {},
    });

    return res.status(201).json(savedFeedback);
  } catch (error) {
    console.error('Failed to save feedback:', error);
    return res.status(500).json({ message: 'Unable to save feedback.' });
  }
};
