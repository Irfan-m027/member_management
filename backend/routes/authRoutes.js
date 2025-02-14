const express = require('express');
const { loginAdmin, getAdminProfile } = require('../controllers/authController');
const { protect } = require('../middleware/protect');

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/admin', protect, getAdminProfile);

module.exports = router;