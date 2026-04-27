const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const Feedback = require('../models/feedback.model');

const router = express.Router();

// Get user stats
router.get('/stats', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        console.log('Fetching stats for user:', userId); // Debug log

        // Fetch all feedback for the user only
        const feedbacks = await Feedback.find({ user: userId }).sort({ createdAt: -1 });
        console.log(`Found ${feedbacks.length} feedback records for this user`); // Debug log

        if (!feedbacks || feedbacks.length === 0) {
            return res.json({
                stats: {
                    totalInterviews: 0,
                    averageScore: 0,
                    lastScore: 0,
                    lastInterviewDate: null,
                    feedbackSummary: '',
                    strengthAreas: [],
                    improvementAreas: []
                }
            });
        }

        // Calculate stats
        const totalInterviews = feedbacks.length;
        const averageScore = Math.round(
            feedbacks.reduce((sum, f) => sum + (f.averageScore || 0), 0) / totalInterviews
        );

        const lastFeedback = feedbacks[0];
        const lastScore = lastFeedback?.averageScore || 0;
        const lastInterviewDate = lastFeedback?.createdAt 
            ? new Date(lastFeedback.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            : null;

        // Extract feedback summary and areas
        const feedbackData = lastFeedback?.feedback || {};
        const feedbackSummary = feedbackData.summary || 'No feedback available yet.';
        const strengthAreas = feedbackData.strengths || [];
        const improvementAreas = feedbackData.improvements || [];

        res.json({
            stats: {
                totalInterviews,
                averageScore,
                lastScore,
                lastInterviewDate,
                feedbackSummary,
                strengthAreas,
                improvementAreas
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ 
            message: 'Error fetching user stats',
            error: error.message 
        });
    }
});

module.exports = router;
