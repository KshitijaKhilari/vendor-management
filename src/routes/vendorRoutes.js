const express = require('express');
const vendorController = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorize');
const validateRequest = require('../middleware/validateRequest');
const {
  createVendorValidation,
  updateVendorValidation,
  vendorIdValidation,
  vendorQueryValidation
} = require('../validations/vendorValidation');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('ADMIN'));

router
  .route('/')
  .post(createVendorValidation, validateRequest, vendorController.createVendor)
  .get(vendorQueryValidation, validateRequest, vendorController.getVendors);

router
  .route('/:id')
  .get(vendorIdValidation, validateRequest, vendorController.getVendorById)
  .put(updateVendorValidation, validateRequest, vendorController.updateVendor)
  .delete(vendorIdValidation, validateRequest, vendorController.deleteVendor);

module.exports = router;
