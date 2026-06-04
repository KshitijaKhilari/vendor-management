const { body, param, query } = require('express-validator');

const phonePattern = /^[0-9+\-\s()]{7,20}$/;

const vendorIdValidation = [
  param('id')
    .isUUID()
    .withMessage('Vendor ID must be a valid UUID')
];

const createVendorValidation = [
  body('vendorName')
    .trim()
    .notEmpty()
    .withMessage('Vendor name is required')
    .isLength({ max: 120 })
    .withMessage('Vendor name cannot exceed 120 characters'),
  body('contactPerson')
    .trim()
    .notEmpty()
    .withMessage('Contact person name is required')
    .isLength({ max: 120 })
    .withMessage('Contact person name cannot exceed 120 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Enter a valid email address')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(phonePattern)
    .withMessage('Enter a valid phone number'),
  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 160 })
    .withMessage('Company name cannot exceed 160 characters'),
  body('gstNumber')
    .trim()
    .notEmpty()
    .withMessage('GST number is required')
    .isLength({ min: 5, max: 30 })
    .withMessage('GST number must be between 5 and 30 characters'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ max: 300 })
    .withMessage('Address cannot exceed 300 characters'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 80 })
    .withMessage('City cannot exceed 80 characters'),
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required')
    .isLength({ max: 80 })
    .withMessage('State cannot exceed 80 characters'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Status must be ACTIVE or INACTIVE')
];

const updateVendorValidation = [
  ...vendorIdValidation,
  body('vendorName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Vendor name cannot be empty')
    .isLength({ max: 120 })
    .withMessage('Vendor name cannot exceed 120 characters'),
  body('contactPerson')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Contact person name cannot be empty')
    .isLength({ max: 120 })
    .withMessage('Contact person name cannot exceed 120 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Enter a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .matches(phonePattern)
    .withMessage('Enter a valid phone number'),
  body('companyName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company name cannot be empty')
    .isLength({ max: 160 })
    .withMessage('Company name cannot exceed 160 characters'),
  body('gstNumber')
    .optional()
    .trim()
    .isLength({ min: 5, max: 30 })
    .withMessage('GST number must be between 5 and 30 characters'),
  body('address')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Address cannot be empty')
    .isLength({ max: 300 })
    .withMessage('Address cannot exceed 300 characters'),
  body('city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City cannot be empty')
    .isLength({ max: 80 })
    .withMessage('City cannot exceed 80 characters'),
  body('state')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('State cannot be empty')
    .isLength({ max: 80 })
    .withMessage('State cannot exceed 80 characters'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Status must be ACTIVE or INACTIVE')
];

const vendorQueryValidation = [
  query('search').optional().trim().isLength({ max: 120 }).withMessage('Search cannot exceed 120 characters'),
  query('status').optional().isIn(['ACTIVE', 'INACTIVE']).withMessage('Status must be ACTIVE or INACTIVE'),
  query('city').optional().trim().isLength({ max: 80 }).withMessage('City cannot exceed 80 characters'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive number'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['vendorName', 'createdAt', 'companyName']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
];

module.exports = {
  createVendorValidation,
  updateVendorValidation,
  vendorIdValidation,
  vendorQueryValidation
};
