# Database Entity-Relationship Specification

```mermaid
erDiagram
    ORGANIZATIONS ||--o{ USERS : has
    ORGANIZATIONS ||--o{ CUSTOMERS : serves
    ORGANIZATIONS ||--o{ SKILLS : maintains
    ORGANIZATIONS ||--o{ SERVICE_CATALOG : offers
    ORGANIZATIONS ||--o{ INVENTORY_ITEMS : stocks

    USERS ||--o| TECHNICIAN_PROFILES : has
    USERS ||--o{ AUDIT_LOGS : performs
    USERS ||--o{ NOTIFICATIONS : receives

    TECHNICIAN_PROFILES ||--o{ TECHNICIAN_SKILLS : possesses
    SKILLS ||--o{ TECHNICIAN_SKILLS : categorized_under

    CUSTOMERS ||--o{ CUSTOMER_ADDRESSES : resides_at
    CUSTOMERS ||--o{ SERVICE_REQUESTS : submits
    CUSTOMERS ||--o{ WORK_ORDERS : receives_service

    SERVICE_CATALOG ||--o{ SERVICE_REQUESTS : categorizes
    SERVICE_CATALOG ||--o{ WORK_ORDERS : specifies

    SERVICE_REQUESTS ||--o{ WORK_ORDERS : originates

    WORK_ORDERS ||--o{ WORK_ORDER_ASSIGNMENTS : assigned_to
    TECHNICIAN_PROFILES ||--o{ WORK_ORDER_ASSIGNMENTS : performs

    WORK_ORDERS ||--o{ WORK_ORDER_STATUS_HISTORY : transitions
    WORK_ORDERS ||--o{ WORK_ORDER_CHECKLISTS : requires
    WORK_ORDER_CHECKLISTS ||--o{ CHECKLIST_ITEMS : contains

    WORK_ORDERS ||--o{ PARTS_USAGE : consumes
    INVENTORY_ITEMS ||--o{ PARTS_USAGE : supplied_from

    WORK_ORDERS ||--o{ INVOICES : billed_in
    INVOICES ||--o{ INVOICE_ITEMS : contains
    INVOICES ||--o{ PAYMENTS : settles
```

## Key Relational Invariants
- An `Organization` is the top-level tenancy boundary.
- A `Customer` and their `CustomerAddress` belong to an `Organization`.
- A `WorkOrder` assignment checks for overlaps across `WorkOrderAssignment` join with scheduled intervals.
- `PartsUsage` deducts from `InventoryItem.quantityOnHand` within an atomic database transaction.
- `Invoices` reference a `WorkOrder` and compute line item totals using exact decimal arithmetic.

