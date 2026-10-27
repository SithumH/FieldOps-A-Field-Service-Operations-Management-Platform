# ADR 001: Selection of Monorepo Architecture and Core Technology Stack

## Status
Accepted

## Context
FieldOps is an enterprise full-stack Field Service Dispatch & Operations platform requiring synchronization between the React client, Node.js Express REST API, database schemas, and data transfer contracts. We need a development setup that supports type safety across boundaries, consistent code standards, automated testing, and clean project management.

## Decision
We adopt an npm workspaces monorepo structure:
- **`apps/web`**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query.
- **`apps/api`**: Node.js, Express, TypeScript, Prisma ORM.
- **`packages/contracts`**: Shared TypeScript definitions, Enums, Zod validation schemas, and API response interfaces.
- **`Database`**: PostgreSQL 16 (Relational database with transactions and strict constraints).
- **`Authentication`**: Secure HTTP-only session cookies with Argon2id password hashing.

## Consequences
- **Pros**:
  - Full type safety from database query to API response to frontend form.
  - Zero drift between backend validation schemas and frontend input validation.
  - Single repository for versioning, CI/CD checks, and unified dependency management.
- **Cons**:
  - Requires npm workspaces build discipline (`tsc` on shared packages before consuming).

