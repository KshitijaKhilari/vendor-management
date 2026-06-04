const vendorService = require('../services/vendorService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const createVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.createVendor(req.body);

  return sendSuccess(res, 201, 'Vendor created successfully', vendor);
});

const getVendors = asyncHandler(async (req, res) => {
  const result = await vendorService.getVendors(req.query);

  return sendSuccess(res, 200, 'Vendors fetched successfully', result.vendors, result.pagination);
});

const getVendorById = asyncHandler(async (req, res) => {
  const vendor = await vendorService.getVendorById(req.params.id);

  return sendSuccess(res, 200, 'Vendor fetched successfully', vendor);
});

const updateVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.updateVendor(req.params.id, req.body);

  return sendSuccess(res, 200, 'Vendor updated successfully', vendor);
});

const deleteVendor = asyncHandler(async (req, res) => {
  await vendorService.deleteVendor(req.params.id);

  return sendSuccess(res, 200, 'Vendor deleted successfully');
});

module.exports = {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor
};
