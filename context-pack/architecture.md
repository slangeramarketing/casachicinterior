Overall Architecture:
- Modular, feature-based backend
- Mobile-ready API architecture
- Clear separation between domain logic and framework adapters

Backend Structure:
modules/
  auth/
  blogs/
  projects/
  skills/

Each module contains:
- *.model.ts        → DB schema
- *.types.ts        → DB record types (repository ↔ service)
- *.dto.ts          → external contracts (service ↔ UI / API)
- *.mapper.ts       → Record ↔ DTO mapping
- *.repository.ts   → DB operations only
- *.service.ts      → business logic
- *.controller.ts   → API layer (auth & APIs only, optional)
- *.server.ts       → Server Facade (Next.js adapter)

--------------------------------------------------

Server Facade Layer (`*.server.ts`):
- Replaces the Action layer completely
- Acts as a Next.js–specific adapter
- Single server-side entry point per module

Used by:
- Server Components (READ operations)
- Server Actions (WRITE operations)

Responsibilities:
- Call service layer
- Apply mapper before returning data
- Perform authentication & role checks for mutations

Restrictions:
- Must NOT access repository directly
- Must NOT contain business logic
- Must NOT perform DB formatting or transformations

--------------------------------------------------

Controller Layer:
- Used ONLY for:
  - Authentication APIs
  - Public APIs
  - Mobile application APIs
- Controllers handle HTTP request/response lifecycle
- Controllers must delegate business logic to services

--------------------------------------------------

Layer Responsibilities:

Repository Layer:
- Communicates with MongoDB via Mongoose
- Uses `.lean()` to return plain JavaScript objects
- Returns raw DB records only
- No DTO or business logic allowed

Mapper Layer:
- Converts DB records to DTOs
- Handles `_id → id` conversion
- Handles Date → string serialization
- Acts as a strict boundary between DB and external layers

Service Layer:
- Contains all business logic
- Chooses repository methods
- Calls mapper to produce DTOs
- Never depends on Next.js APIs

--------------------------------------------------

Stateless backend layers (Repository, Controller, Server Facade)
must use object + method export pattern.

Class-based patterns are intentionally avoided to:
- Reduce abstraction overhead
- Enforce stateless design
- Maintain functional composition
