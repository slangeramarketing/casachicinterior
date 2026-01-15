Backend Rules:
- Service layer contains ALL business logic
- Repository layer handles DB only
- Controller never contains business logic
- Actions never talk directly to DB

Security Rules:
- JWT authentication via jwt.ts
- Middleware for auth & role checks
- Admin role required for:
  - Create
  - Update
  - Delete (blogs, projects, skills, pricing)

Validation & Errors:
- Basic validation at controller/action level
- Centralized exception handling
- No silent failures

Repository Rules:
- Repository layer must NEVER return Mongoose Documents
- Repository must return plain JavaScript objects only
- Use `.lean()` or `.toObject()` inside repository
- Repository must not perform mapping or DTO conversion
- Repository handles DB access only, nothing else


Database:
- db.ts for MongoDB connection
- Reusable DB connection logic


Data Access & Flow Rules:

- Public Server Components may READ data directly from service layer
- Admin Server Components may READ data directly from service layer
- Any CREATE, UPDATE, or DELETE operation MUST go through Action layer
- Server Components must NEVER perform write operations directly
- Action layer is mandatory for all mutation operations
- Action layer must perform auth and role checks
- Services are the single source of business logic
- Repositories must never be accessed directly by UI layers


Auth Rules:
- Login, logout, token generation must live in auth module
- Users module must not handle authentication logic
- Auth module may read user data, users module must never handle auth

Server Facade Rules (`*.server.ts`):
- In `*.server.ts`, `cookies()` returns a Promise and MUST be awaited
- Do not access cookies synchronously inside `*.server.ts`
- Server Components may access `cookies()` synchronously
- Authentication helpers used inside `*.server.ts` must be async-safe



