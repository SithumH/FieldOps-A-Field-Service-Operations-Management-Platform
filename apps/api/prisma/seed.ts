import { PrismaClient, Role, UserStatus, Priority, WorkOrderStatus } from '@prisma/client';
import { hashPassword } from '../src/common/security/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding FieldOps Production-grade Demo Data...');

  // 1. Create Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'apex-services' },
    update: {},
    create: {
      name: 'Apex Mechanical & Electrical Services',
      slug: 'apex-services',
      email: 'contact@apexservices.lk',
      phone: '+94 11 234 5678',
      address: 'No 45, Galle Road, Colombo 03, Sri Lanka',
    },
  });

  const defaultPasswordHash = await hashPassword('Password123!');

  // 2. Create Users
  const orgAdmin = await prisma.user.upsert({
    where: { email: 'admin@apexservices.lk' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'admin@apexservices.lk',
      passwordHash: defaultPasswordHash,
      role: Role.ORG_ADMIN,
      firstName: 'Sanath',
      lastName: 'Jayawardena',
      phone: '+94 77 100 2000',
    },
  });

  const dispatcher = await prisma.user.upsert({
    where: { email: 'dispatch@apexservices.lk' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'dispatch@apexservices.lk',
      passwordHash: defaultPasswordHash,
      role: Role.DISPATCHER,
      firstName: 'Samantha',
      lastName: 'Silva',
      phone: '+94 77 200 3000',
    },
  });

  const techUser1 = await prisma.user.upsert({
    where: { email: 'kasun.technician@apexservices.lk' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'kasun.technician@apexservices.lk',
      passwordHash: defaultPasswordHash,
      role: Role.TECHNICIAN,
      firstName: 'Kasun',
      lastName: 'Perera',
      phone: '+94 77 300 4000',
    },
  });

  const techProfile1 = await prisma.technicianProfile.upsert({
    where: { userId: techUser1.id },
    update: {},
    create: {
      userId: techUser1.id,
      isAvailable: true,
      hourlyRate: 35.0,
      notes: 'Senior HVAC & Refrigeration certified technician',
    },
  });

  // 3. Create Skills
  const hvacSkill = await prisma.skill.upsert({
    where: {
      organizationId_name: {
        organizationId: org.id,
        name: 'HVAC Advanced Diagnostics',
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      name: 'HVAC Advanced Diagnostics',
      description: 'Certified diagnostic capabilities on commercial VRF and chiller units',
    },
  });

  await prisma.technicianSkill.upsert({
    where: {
      technicianId_skillId: {
        technicianId: techProfile1.id,
        skillId: hvacSkill.id,
      },
    },
    update: {},
    create: {
      technicianId: techProfile1.id,
      skillId: hvacSkill.id,
    },
  });

  // 4. Create Service Catalog
  const serviceAc = await prisma.serviceCatalog.upsert({
    where: {
      organizationId_name: {
        organizationId: org.id,
        name: 'Commercial VRF AC Inspection & Tune-Up',
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Commercial VRF AC Inspection & Tune-Up',
      description: 'Comprehensive pressure, condenser, and refrigerant operational testing',
      defaultDuration: 120,
      basePrice: 150.0,
    },
  });

  // 5. Create Customer and Address
  const customer = await prisma.customer.upsert({
    where: {
      organizationId_email: {
        organizationId: org.id,
        email: 'facilities@colombologistichub.lk',
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Colombo Logistics Warehouse Hub',
      email: 'facilities@colombologistichub.lk',
      phone: '+94 11 555 7788',
      companyName: 'Colombo Logistics Ltd',
      addresses: {
        create: {
          label: 'Main Cold Storage Facility',
          street: '100 Industrial Zone Expressway',
          city: 'Peliyagoda',
          state: 'Western',
          postalCode: '11830',
          country: 'LK',
        },
      },
    },
    include: {
      addresses: true,
    },
  });

  // 6. Create Inventory Items
  const refrigerant = await prisma.inventoryItem.upsert({
    where: {
      organizationId_sku: {
        organizationId: org.id,
        sku: 'R410A-CYL',
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      sku: 'R410A-CYL',
      name: 'R-410A Refrigerant 11.3kg Cylinder',
      description: 'Virgin grade environmental refrigerant gas cylinder',
      unitCost: 80.0,
      unitPrice: 140.0,
      quantityOnHand: 15,
      reorderLevel: 4,
    },
  });

  const capacitor = await prisma.inventoryItem.upsert({
    where: {
      organizationId_sku: {
        organizationId: org.id,
        sku: 'CAP-45-5',
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      sku: 'CAP-45-5',
      name: 'Dual Run Capacitor 45/5 MFD 440V',
      description: 'Heavy duty motor run capacitor',
      unitCost: 12.0,
      unitPrice: 28.0,
      quantityOnHand: 32,
      reorderLevel: 8,
    },
  });

  // 7. Create a Sample Work Order in Progress
  const workOrderNumber = 'WO-2026-1001';
  const existingWo = await prisma.workOrder.findUnique({ where: { workOrderNumber } });

  if (!existingWo) {
    const workOrder = await prisma.workOrder.create({
      data: {
        workOrderNumber,
        customerId: customer.id,
        serviceId: serviceAc.id,
        addressId: customer.addresses[0]?.id,
        title: 'Cold Storage Room 02 AC Leaking & Cooling Fault',
        description: 'Temperatures rising in pharmaceutical bay room 02. Condenser fan running erratically.',
        priority: Priority.HIGH,
        status: WorkOrderStatus.ASSIGNED,
        scheduledStart: new Date(Date.now() + 2 * 60 * 60 * 1000), // In 2 hours
        scheduledEnd: new Date(Date.now() + 4 * 60 * 60 * 1000),
        customerNotes: 'Please check in with security gate 3 upon arrival.',
        assignments: {
          create: {
            technicianId: techProfile1.id,
            notes: 'High priority cold storage ticket. Carry diagnostic gauge manifold.',
          },
        },
        checklists: {
          create: {
            title: 'Standard Cold Storage Diagnostic Protocol',
            items: {
              create: [
                { description: 'Isolate main 400V circuit breaker before panel removal' },
                { description: 'Measure suction and discharge refrigerant pressures' },
                { description: 'Inspect run capacitor capacitance with multimeter' },
                { description: 'Clean condenser coils with low-pressure wash' },
              ],
            },
          },
        },
      },
    });

    console.log(`✅ Sample Work Order created: ${workOrder.workOrderNumber}`);
  }

  console.log('✨ FieldOps database seed completed successfully!');
  console.log(`👤 Admin: admin@apexservices.lk (Password: Password123!)`);
  console.log(`👤 Dispatcher: dispatch@apexservices.lk (Password: Password123!)`);
  console.log(`👤 Technician: kasun.technician@apexservices.lk (Password: Password123!)`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

