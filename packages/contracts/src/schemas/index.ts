import { z } from 'zod';
import { PriorityLevel, WorkOrderStatus, ServiceRequestStatus } from '../enums';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerOrganizationSchema = z.object({
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  adminFirstName: z.string().min(1, 'First name is required'),
  adminLastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
});

export type RegisterOrganizationInput = z.infer<typeof registerOrganizationSchema>;

export const customerAddressSchema = z.object({
  label: z.string().default('Primary'),
  street: z.string().min(3, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State / Province is required'),
  postalCode: z.string().min(2, 'Postal code is required'),
  country: z.string().default('LK'),
});

export type CustomerAddressInput = z.infer<typeof customerAddressSchema>;

export const createCustomerSchema = z.object({
  name: z.string().min(2, 'Customer name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Valid contact phone number is required'),
  companyName: z.string().optional(),
  address: customerAddressSchema.optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export const createServiceCatalogItemSchema = z.object({
  name: z.string().min(2, 'Service name is required'),
  description: z.string().optional(),
  defaultDuration: z.number().int().min(15).default(60),
  basePrice: z.number().min(0).default(0),
});

export type CreateServiceCatalogItemInput = z.infer<typeof createServiceCatalogItemSchema>;

export const createServiceRequestSchema = z.object({
  customerId: z.string().uuid('Valid customer ID is required'),
  serviceId: z.string().uuid().optional(),
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(5, 'Please provide a description of the issue'),
  priority: z.nativeEnum(PriorityLevel).default(PriorityLevel.MEDIUM),
  preferredDate: z.string().datetime().optional(),
  addressId: z.string().uuid().optional(),
});

export type CreateServiceRequestInput = z.infer<typeof createServiceRequestSchema>;

export const updateServiceRequestStatusSchema = z.object({
  status: z.nativeEnum(ServiceRequestStatus),
  notes: z.string().optional(),
});

export type UpdateServiceRequestStatusInput = z.infer<typeof updateServiceRequestStatusSchema>;

export const createWorkOrderSchema = z.object({
  requestId: z.string().uuid().optional(),
  customerId: z.string().uuid('Customer ID is required'),
  serviceId: z.string().uuid().optional(),
  addressId: z.string().uuid().optional(),
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(5, 'Description is required'),
  priority: z.nativeEnum(PriorityLevel).default(PriorityLevel.MEDIUM),
  scheduledStart: z.string().datetime().optional(),
  scheduledEnd: z.string().datetime().optional(),
  customerNotes: z.string().optional(),
  internalNotes: z.string().optional(),
});

export type CreateWorkOrderInput = z.infer<typeof createWorkOrderSchema>;

export const rescheduleWorkOrderSchema = z.object({
  scheduledStart: z.string().datetime('Start time must be ISO 8601 datetime'),
  scheduledEnd: z.string().datetime('End time must be ISO 8601 datetime'),
  reason: z.string().min(3, 'Reason for rescheduling is required'),
});

export type RescheduleWorkOrderInput = z.infer<typeof rescheduleWorkOrderSchema>;

export const assignTechnicianSchema = z.object({
  technicianId: z.string().uuid('Invalid technician ID'),
  scheduledStart: z.string().datetime('Start time must be a valid ISO 8601 datetime'),
  scheduledEnd: z.string().datetime('End time must be a valid ISO 8601 datetime'),
  notes: z.string().optional(),
});

export type AssignTechnicianInput = z.infer<typeof assignTechnicianSchema>;

export const updateWorkOrderStatusSchema = z.object({
  status: z.nativeEnum(WorkOrderStatus),
  reason: z.string().optional(),
});

export type UpdateWorkOrderStatusInput = z.infer<typeof updateWorkOrderStatusSchema>;

export const createChecklistSchema = z.object({
  title: z.string().min(2, 'Checklist title is required'),
  items: z.array(z.string().min(1, 'Item description cannot be empty')).min(1, 'At least one checklist item is required'),
});

export type CreateChecklistInput = z.infer<typeof createChecklistSchema>;

export const createInventoryItemSchema = z.object({
  sku: z.string().min(2, 'SKU is required'),
  name: z.string().min(2, 'Part name is required'),
  description: z.string().optional(),
  unitCost: z.number().min(0).default(0),
  unitPrice: z.number().min(0),
  quantityOnHand: z.number().int().min(0).default(0),
  reorderLevel: z.number().int().min(0).default(5),
});

export type CreateInventoryItemInput = z.infer<typeof createInventoryItemSchema>;

export const recordPartsUsageSchema = z.object({
  inventoryItemId: z.string().uuid('Valid inventory item ID is required'),
  quantity: z.number().int().positive('Quantity must be greater than zero'),
});

export type RecordPartsUsageInput = z.infer<typeof recordPartsUsageSchema>;

export const generateInvoiceSchema = z.object({
  taxRate: z.number().min(0).max(100).default(0),
  dueDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export type GenerateInvoiceInput = z.infer<typeof generateInvoiceSchema>;

export const recordPaymentSchema = z.object({
  amount: z.number().positive('Payment amount must be greater than zero'),
  method: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'ONLINE']).default('ONLINE'),
  reference: z.string().optional(),
});

export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;



