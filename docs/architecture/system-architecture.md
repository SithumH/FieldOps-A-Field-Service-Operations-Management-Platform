# FieldOps System Architecture

```mermaid
graph TD
    subgraph Client Layer
        Web["Web Application (React + Vite + Tailwind)"]
        Mobile["Technician Mobile View (Responsive Web)"]
    end

    subgraph API Gateway / Server
        Express["Express.js HTTP Server"]
        AuthMiddleware["Session & RBAC Middleware"]
        TenantGuard["Multi-Tenant Isolation Guard"]
    end

    subgraph Domain Modules
        AuthMod["Auth & Tenant Management"]
        CustomerMod["Customer & Address Management"]
        SchedulingMod["Dispatch & Conflict-Free Scheduling Engine"]
        ExecutionMod["Work Order & Checklist Execution"]
        InventoryMod["Inventory & Parts Deduction"]
        BillingMod["Invoicing & Payment Engine"]
    end

    subgraph Data Layer
        PrismaORM["Prisma ORM (Type-Safe Layer)"]
        PostgreSQL[(PostgreSQL Relational DB)]
    end

    Web --> Express
    Mobile --> Express
    Express --> AuthMiddleware --> TenantGuard
    TenantGuard --> AuthMod
    TenantGuard --> CustomerMod
    TenantGuard --> SchedulingMod
    TenantGuard --> ExecutionMod
    TenantGuard --> InventoryMod
    TenantGuard --> BillingMod

    AuthMod --> PrismaORM
    CustomerMod --> PrismaORM
    SchedulingMod --> PrismaORM
    ExecutionMod --> PrismaORM
    InventoryMod --> PrismaORM
    BillingMod --> PrismaORM
    PrismaORM --> PostgreSQL
```

## Security & Architecture Principles
1. **Multi-Tenancy Enforced at Database Queries**: Queries strictly filter by `organization_id` or join through parent ownership relations.
2. **Defensive Status Transitions**: State machine transitions for Work Orders are strictly validated by domain services.
3. **Financial Precision**: All monetary values are handled using `DECIMAL(10,2)` in PostgreSQL and processed as precise Decimal objects in backend services.
4. **Shared Type Contracts**: The `@fieldops/contracts` workspace ensures contract consistency between frontend forms, API DTOs, and schema validations.

