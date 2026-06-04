const express = require('express');
const authRoutes = require('./authRoutes');
const vendorRoutes = require('./vendorRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vendor Management System API is running'
  });
});

router.use('/auth', authRoutes);
router.use('/vendors', vendorRoutes);

module.exports = router;
