const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const vendors = [
  {
    vendorName: 'ABC Suppliers',
    contactPerson: 'Rahul Sharma',
    email: 'rahul@abcsuppliers.com',
    phone: '9876543210',
    companyName: 'ABC Trading Pvt Ltd',
    gstNumber: '27ABCDE1234F1Z5',
    address: 'MG Road, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    status: 'ACTIVE'
  },
  {
    vendorName: 'Prime Office Solutions',
    contactPerson: 'Neha Verma',
    email: 'neha@primeoffice.com',
    phone: '9876543211',
    companyName: 'Prime Office Solutions LLP',
    gstNumber: '29PRIME1234F1Z8',
    address: 'Koramangala 5th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    status: 'ACTIVE'
  },
  {
    vendorName: 'Green Pack Industries',
    contactPerson: 'Amit Patel',
    email: 'amit@greenpack.in',
    phone: '9876543212',
    companyName: 'Green Pack Industries',
    gstNumber: '24GREEN1234F1Z3',
    address: 'GIDC Industrial Estate',
    city: 'Ahmedabad',
    state: 'Gujarat',
    status: 'ACTIVE'
  },
  {
    vendorName: 'TechNova Services',
    contactPerson: 'Sneha Iyer',
    email: 'sneha@technova.com',
    phone: '9876543213',
    companyName: 'TechNova Services Pvt Ltd',
    gstNumber: '33TECHN1234F1Z9',
    address: 'OMR IT Corridor',
    city: 'Chennai',
    state: 'Tamil Nadu',
    status: 'ACTIVE'
  },
  {
    vendorName: 'NorthStar Logistics',
    contactPerson: 'Vikram Singh',
    email: 'vikram@northstarlogistics.com',
    phone: '9876543214',
    companyName: 'NorthStar Logistics Co',
    gstNumber: '07NORTH1234F1Z2',
    address: 'Okhla Industrial Area',
    city: 'Delhi',
    state: 'Delhi',
    status: 'ACTIVE'
  },
  {
    vendorName: 'Metro Electricals',
    contactPerson: 'Pooja Mehta',
    email: 'pooja@metroelectricals.in',
    phone: '9876543215',
    companyName: 'Metro Electricals',
    gstNumber: '19METRO1234F1Z6',
    address: 'Salt Lake Sector V',
    city: 'Kolkata',
    state: 'West Bengal',
    status: 'INACTIVE'
  },
  {
    vendorName: 'BlueLine Stationery',
    contactPerson: 'Karan Malhotra',
    email: 'karan@bluelinestationery.com',
    phone: '9876543216',
    companyName: 'BlueLine Stationery Mart',
    gstNumber: '06BLUE1234F1Z1',
    address: 'Sector 14 Market',
    city: 'Gurugram',
    state: 'Haryana',
    status: 'ACTIVE'
  },
  {
    vendorName: 'Sunrise Facility Care',
    contactPerson: 'Meera Nair',
    email: 'meera@sunrisefacility.com',
    phone: '9876543217',
    companyName: 'Sunrise Facility Care Pvt Ltd',
    gstNumber: '32SUNRI1234F1Z4',
    address: 'Marine Drive',
    city: 'Kochi',
    state: 'Kerala',
    status: 'ACTIVE'
  },
  {
    vendorName: 'Royal Hardware Depot',
    contactPerson: 'Imran Khan',
    email: 'imran@royalhardware.in',
    phone: '9876543218',
    companyName: 'Royal Hardware Depot',
    gstNumber: '08ROYAL1234F1Z7',
    address: 'MI Road',
    city: 'Jaipur',
    state: 'Rajasthan',
    status: 'INACTIVE'
  },
  {
    vendorName: 'Delta Safety Equipments',
    contactPerson: 'Ritika Joshi',
    email: 'ritika@deltasafety.com',
    phone: '9876543219',
    companyName: 'Delta Safety Equipments Pvt Ltd',
    gstNumber: '27DELTA1234F1Z0',
    address: 'Hinjewadi Phase 1',
    city: 'Pune',
    state: 'Maharashtra',
    status: 'ACTIVE'
  }
];

const main = async () => {
  const password = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password,
      role: 'ADMIN'
    }
  });

  for (const vendor of vendors) {
    const existingVendor = await prisma.vendor.findFirst({
      where: {
        OR: [
          { email: vendor.email },
          { phone: vendor.phone },
          { gstNumber: vendor.gstNumber }
        ]
      }
    });

    if (existingVendor) {
      await prisma.vendor.update({
        where: { id: existingVendor.id },
        data: {
          ...vendor,
          deletedAt: null
        }
      });
    } else {
      await prisma.vendor.create({
        data: vendor
      });
    }
  }

  console.log('Seed completed: 1 admin user and 10 sample vendors added.');
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
