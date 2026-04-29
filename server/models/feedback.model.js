const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    interviewId: {
      type: String,
      sparse: true, // Allows multiple null values for backward compatibility
      unique: true, // Ensures no duplicate interviews
    },
    role: {
      type: String,
      required: false,
    },
    averageScore: {
      type: Number,
      required: true,
    },
    feedback: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
