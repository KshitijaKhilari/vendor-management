const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

const vendorSelect = {
  id: true,
  vendorName: true,
  contactPerson: true,
  email: true,
  phone: true,
  companyName: true,
  gstNumber: true,
  address: true,
  city: true,
  state: true,
  status: true,
  createdAt: true,
  updatedAt: true
};

const normalizeVendorInput = (data) => ({
  vendorName: data.vendorName,
  contactPerson: data.contactPerson,
  email: data.email,
  phone: data.phone,
  companyName: data.companyName,
  gstNumber: data.gstNumber,
  address: data.address,
  city: data.city,
  state: data.state,
  status: data.status
});

const removeUndefined = (data) => {
  return Object.fromEntries(Object.entries(data).filter((entry) => entry[1] !== undefined));
};

const assertNoDuplicateVendor = async ({ email, phone, gstNumber }, excludeId = null) => {
  const duplicateChecks = [];

  if (email) {
    duplicateChecks.push({ email });
  }

  if (phone) {
    duplicateChecks.push({ phone });
  }

  if (gstNumber) {
    duplicateChecks.push({ gstNumber });
  }

  if (duplicateChecks.length === 0) {
    return;
  }

  const duplicate = await prisma.vendor.findFirst({
    where: {
      deletedAt: null,
      OR: duplicateChecks,
      NOT: excludeId ? { id: excludeId } : undefined
    }
  });

  if (duplicate) {
    throw new AppError('Vendor with this email, phone, or GST number already exists', 409);
  }
};

const createVendor = async (data) => {
  const payload = removeUndefined(normalizeVendorInput(data));
  await assertNoDuplicateVendor(payload);

  return prisma.vendor.create({
    data: payload,
    select: vendorSelect
  });
};

const getVendors = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder || 'desc';

  const where = {
    deletedAt: null
  };

  if (query.search) {
    where.OR = [
      {
        vendorName: {
          contains: query.search,
          mode: 'insensitive'
        }
      },
      {
        companyName: {
          contains: query.search,
          mode: 'insensitive'
        }
      }
    ];
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.city) {
    where.city = {
      equals: query.city,
      mode: 'insensitive'
    };
  }

  const [vendors, totalRecords] = await Promise.all([
    prisma.vendor.findMany({
      where,
      select: vendorSelect,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      }
    }),
    prisma.vendor.count({ where })
  ]);

  return {
    vendors,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit)
    }
  };
};

const getVendorById = async (id) => {
  const vendor = await prisma.vendor.findFirst({
    where: {
      id,
      deletedAt: null
    },
    select: vendorSelect
  });

  if (!vendor) {
    throw new AppError('Vendor not found', 404);
  }

  return vendor;
};

const updateVendor = async (id, data) => {
  await getVendorById(id);

  const payload = removeUndefined(normalizeVendorInput(data));
  await assertNoDuplicateVendor(payload, id);

  return prisma.vendor.update({
    where: { id },
    data: payload,
    select: vendorSelect
  });
};

const deleteVendor = async (id) => {
  await getVendorById(id);

  await prisma.vendor.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      status: 'INACTIVE'
    }
  });
};

module.exports = {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor
};
