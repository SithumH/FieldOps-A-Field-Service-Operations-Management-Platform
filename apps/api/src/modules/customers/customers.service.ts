import { customersRepository, CustomersRepository } from './customers.repository';
import { CreateCustomerInput } from '@fieldops/contracts';
import { ConflictError, NotFoundError } from '../../common/errors/app-error';

export class CustomersService {
  constructor(private repo: CustomersRepository = customersRepository) {}

  async listCustomers(organizationId: string, search?: string) {
    return this.repo.findByOrganization(organizationId, search);
  }

  async getCustomerById(id: string, organizationId: string) {
    const customer = await this.repo.findById(id, organizationId);
    if (!customer) {
      throw new NotFoundError('Customer not found in this organization');
    }
    return customer;
  }

  async createCustomer(organizationId: string, input: CreateCustomerInput) {
    const existing = await this.repo.findByEmail(input.email, organizationId);
    if (existing) {
      throw new ConflictError('A customer with this email already exists in your organization');
    }

    return this.repo.create(organizationId, input);
  }
}

export const customersService = new CustomersService();

