const express = require('express');
const { loginAdmin, getAdmin } = require('../controllers/authControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/admin', protect, getAdmin);

module.exports = router;