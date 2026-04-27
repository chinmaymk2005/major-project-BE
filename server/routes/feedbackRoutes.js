const express = require('express');
const { saveFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, saveFeedback);

module.exports = router;
