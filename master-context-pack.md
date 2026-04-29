# Master Context Pack: CasaChic Interior
*Compiled from the `/context-pack` directory.*

---

## 1. Project Overview (`project.md`)

Project Name:
Casa-Chic Interior Business Portfolio + Admin Panel

Purpose:
- Public Business portfolio+ Admin website For showcase of Casachichinterior service and soutions
- Admin panel for managing blogs, projects, Service, User trafic analytics , Performance trac, 
- Future-ready backendd

Core Goals:
- Scalable backend architecture
- Clean separation of concerns
- Industry-standard structure

Non-Goals:
- No Firebase
- No WordPress
- No tightly coupled frontend-backend logic

---

## 2. System Guarantees & AI Guidelines (`system.md`)

You are acting as a senior full-stack architect.

Strict rules:
- Follow this context pack strictly
- Do not suggest alternative stacks unless asked
- Assume the user understands fundamentals
- Focus on scalability, maintainability, and industry standards
- Do not mix frontend and backend responsibilities
- Ask clarification ONLY if a blocker exists
- Follow the defined project structure strictly
- Enforce read/write flow rules strictly


# System Guarantees

## Build-Time Safety
- DB is never accessed during build or prerender
- Server Actions execute only at runtime

## Scalability
- Mobile apps can reuse service + repository layers
- UI remains thin and replaceable

## Maintainability
- Clear ownership of logic
- Easy debugging of DB-related errors

---

## 3. Tech Stack (`tech.md`)

Frontend:
- Next.js (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Server Components for all public pages
- Client Components only for interactivity
- Framer Motion for animations
- React Icons for iconography
- md5 for generating client profile icons (e.g., Gravatar-style)

Backend:
- Next.js (Full-stack)
- MongoDB with Mongoose
- JWT-based authentication
- HTTP-only cookies for auth tokens
- Middleware-based authorization

Pages Strategy:
- All client-facing routes are Server Pages:
  /, /services, /blogs, /projects
- Server Pages import Client Components
- No data fetching inside Client Components

---

## 4. Architecture (`architecture.md`)

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


# Architecture – Data Flow Rules

This project follows a strict unidirectional server-side data flow.

## ❗ Core Rule
No database access is allowed directly from `page.tsx`, `layout.tsx`,
or any React component (client or server).

All database interactions must flow through Server Actions.

## Allowed Flow
page.tsx → actions/*.ts → *.server.ts → *.service.ts → *.repository.ts → db

## Disallowed
- page.tsx → service
- page.tsx → server facade
- layout.tsx → db / service / server
- component → repository

---

## 5. Structure (`structure.md`)

Canonical Project Structure:



# Project Structure – Data Flow Oriented

app/
 ├─ (public)/
 │   ├─ page.tsx              # UI only
 │   ├─ services/
 │   │   └─ page.tsx
 │   └─ actions/
 │       ├─ services.actions.ts
 │       ├─ blogs.actions.ts
 │       └─ messages.actions.ts
 │
 ├─ admin/
 │   ├─ page.tsx
 │   └─ actions/
 │       ├─ services.actions.ts
 │       ├─ users.actions.ts
 │
modules/
 ├─ services/
 │   ├─ service.server.ts
 │   ├─ service.service.ts
 │   ├─ service.repository.ts
 │   └─ service.mapper.ts




 app/
  (public)/
    layout.tsx              # Public landing layout (Server Component)
    page.tsx                # Home page (Server Page, imports Client UI)

    blogs/
      page.tsx              # Blog listing (Server Page)
      [slug]/
        page.tsx            # Blog detail (Server Page)

    projects/
      page.tsx              # Project listing (Server Page)
      [slug]/
        page.tsx            # Project detail (Server Page)

  admin/
    blogs/
      page.tsx              # Blog list (Server Page → imports Client table)
      create/
        page.tsx            # Create blog (Server Page → imports Client form)
      update/
        [id]/
          page.tsx          # Read + Update blog (Server Page)



modules/
  auth/
    auth.middleware.ts     # Auth & role decision logic (framework-agnostic)
    auth.service.ts        # Login / logout / token flow
    auth.controller.ts     # Auth APIs (login, refresh, logout)

  users/
    user.model.ts
    user.dto.ts            # Input + Output DTOs
    user.mapper.ts
    user.repository.ts
    user.service.ts
    user.controller.ts
    user.server.ts         # Admin CRUD server actions

  blogs/
    blog.model.ts
    blog.dto.ts
    blog.mapper.ts
    blog.repository.ts
    blog.service.ts
    blog.controller.ts     # APIs (mobile / public if needed)
    blog.server.ts         # Server Actions (Admin CRUD)

lib/
  db.ts                   # MongoDB connection
  jwt.ts                  # JWT sign/verify only
  auth.ts                 # getAuthUser(), token extraction helpers

middleware.ts             # Next.js entry middleware (dispatcher only)


Structure Rules:
- Do not suggest alternative folder structures
- All routing and UI orchestration must stay inside `app/`
- Do not place business logic inside `app/` pages or layouts
- All backend logic must live inside `modules/`
- Every feature must follow the existing module pattern
- Database access is allowed ONLY inside repository layer
- Repositories must return plain JavaScript objects only
- Mapping and DTO conversion must happen in mapper layer
- Business logic must exist ONLY in service layer
- Controllers are allowed ONLY for API and authentication
- Server Actions must call services, never repositories
- Auth logic must live inside `modules/auth`
- User data management must live inside `modules/users`
- Root `middleware.ts` must only delegate to auth middleware
- All new files must respect this structure strictly

---

## 6. Rules & Data Flow (`rules.md`)

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


# Rules – Server & DB Access

## 1. page.tsx
- UI composition only
- Must NOT:
  - call db()
  - call *.service.ts
  - call *.server.ts
- May:
  - import and call Server Actions only

## 2. Server Actions (app/**/actions/*.ts)
- Single ENTRY POINT for DB access
- Must:
  - be marked with `"use server"`
  - call server facade only
- Must NOT:
  - contain business logic
  - access repositories directly

## 3. Server Facade (*.server.ts)
- Acts as controller / adapter
- Responsibilities:
  - auth & role checks
  - call service layer
  - map DB records to DTOs
- Must NOT:
  - access db()
  - contain UI logic

## 4. Service Layer (*.service.ts)
- Contains business rules
- Must:
  - call db() before DB operations
- Must NOT:
  - know about Next.js
  - format responses

## 5. Repository Layer
- Pure DB access
- No logic, no auth, no Next.js imports



Auth Rules:
- Login, logout, token generation must live in auth module
- Users module must not handle authentication logic
- Auth module may read user data, users module must never handle auth

Server Facade Rules (`*.server.ts`):
- In `*.server.ts`, `cookies()` returns a Promise and MUST be awaited
- Do not access cookies synchronously inside `*.server.ts`
- Server Components may access `cookies()` synchronously
- Authentication helpers used inside `*.server.ts` must be async-safe

---

## 7. Development Workflow (`workflow.md`)

Development Workflow:
1. Design module
2. Define DTOs
3. Create model
4. Create repository
5. Implement service logic
6. Add controller or server
7. Add middleware checks
8. Test
9. Integrate UI

Golden Rule:
- Backend design first, UI later


Before merging backend code:
- [ ] Repository uses object + method structure
- [ ] Controller uses object + method structure
- [ ] Server Facade uses object + method structure
- [ ] No class-based exports in these layers



# Workflow – How Data Moves

## Public Pages
page.tsx
 → calls public actions
 → server facade
 → service
 → repository
 → db

## Admin Pages
page.tsx
 → admin actions
 → server facade (auth enforced)
 → service
 → repository
 → db

## APIs
Used ONLY for:
- authentication (login/logout)
- external consumers (mobile apps, webhooks)

UI pages must NOT use API routes for internal data fetching.

---

## 8. Module Architecture Contract (`Module-Architecture-Contract.md`)

# Module Architecture Contract (FINAL)

This contract is MANDATORY for every module.
No deviation is allowed.

--------------------------------------------------
GLOBAL PRINCIPLES
--------------------------------------------------

- Each module is independent and self-contained
- Layers must not leak responsibilities
- Data formatting must happen at the boundary only
- Service layer must remain domain-pure
- Repository must remain DB-pure

--------------------------------------------------
MANDATORY MODULE STRUCTURE
--------------------------------------------------

modules/<module>/
├─ <module>.model.ts        → Mongoose schema only
├─ <module>.types.ts        → Plain DB record types (lean objects)
├─ <module>.dto.ts          → Input / Output contracts
├─ <module>.mapper.ts       → Record → Response conversion
├─ <module>.repository.ts   → Database access only
├─ <module>.service.ts      → Business logic only
├─ <module>.controller.ts   → Public / Mobile APIs (optional)
└─ <module>.server.ts       → Server Facade (Next.js entry point)


--------------------------------------------------
LAYER RESPONSIBILITY RULES
--------------------------------------------------

MODEL LAYER
- Defines schema only
- No logic
- No exports other than model

--------------------------------------------------

TYPES LAYER (*.types.ts)
- Represents raw MongoDB documents
- Must use:
  - `_id: Types.ObjectId`
  - `createdAt: Date`
  - `updatedAt: Date`
- Returned ONLY from repository
- Must NEVER be exposed to UI

--------------------------------------------------

DTO LAYER (*.dto.ts)
- Represents client-facing contracts
- Must NOT use:
  - ObjectId
  - Date
- Uses:
  - `id: string`
  - ISO date strings
- Divided into:
  - Create DTO
  - Update DTO
  - Response DTO

--------------------------------------------------

REPOSITORY LAYER (*.repository.ts)
- Talks to MongoDB only
- Uses `.lean()` or `.toObject()`
- Returns ONLY Plain Types
- Must NEVER:
  - Import DTO
  - Import Mapper
  - Format data
  - Apply business rules

--------------------------------------------------

SERVICE LAYER (*.service.ts)
- Contains ALL business logic
- Performs:
  - Validation
  - Authorization decisions (not auth itself)
  - Domain rules
- Calls repository
- Returns Plain Types ONLY
- Must NEVER:
  - Import mapper
  - Format response
  - Return DTOs

--------------------------------------------------

MAPPER LAYER (*.mapper.ts)
- Converts Plain Types → Response DTO
- Handles:
  - `_id → id`
  - `Date → ISO string`
- Is the ONLY place for formatting
- Must NEVER:
  - Access DB
  - Contain business logic

--------------------------------------------------

CONTROLLER LAYER (*.controller.ts)
- Used for public or mobile APIs
- Calls:
  - Service
  - Mapper
- Returns JSON response
- Must NOT contain business logic

--------------------------------------------------

SERVER FACADE LAYER (*.server.ts)
- Replaces `*.action.ts` completely
- Used for admin mutations AND server-side reads
- Acts as a Next.js–specific server adapter

Must:
- Perform auth / role checks for all WRITE operations
- Call service layer only
- Use mapper ONLY for returning response DTOs

Used by:
- Server Components (READ operations)
- Server Actions (WRITE operations)

Must NEVER:
- Call repository directly
- Contain business logic
- Perform DB formatting
- Return plain DB records

--------------------------------------------------
FORBIDDEN PRACTICES
--------------------------------------------------

❌ Service importing mapper  
❌ Repository importing mapper or DTO  
❌ UI calling repository  
❌ Repository returning formatted data  
❌ Mapper containing logic  
❌ Service returning Response DTO  


--------------------------------------------------
OBJECT + METHOD STRUCTURE RULE (MANDATORY)
--------------------------------------------------

The following layers MUST use object + method structure
for exporting functionality:

- Repository layer (*.repository.ts)
- Controller layer (*.controller.ts)
- Server Facade layer (*.server.ts)

Pattern:
export const <layerName> = {
  methodOne() {},
  methodTwo() {},
};

Reasons:
- Layers are stateless
- Groups related operations clearly
- Avoids unnecessary classes
- Prevents `this` binding bugs
- Improves testability and readability

--------------------------------------------------
FORBIDDEN
--------------------------------------------------

❌ Class-based exports in these layers  
❌ Default exports  
❌ Stateful properties inside exported objects  

--------------------------------------------------
ALLOWED
--------------------------------------------------

✔ Plain object literals  
✔ Async method shorthand  
✔ Named exports only




--------------------------------------------------
GOLDEN RULE
--------------------------------------------------

"If data is formatted, it is no longer domain data."

Formatting belongs ONLY at the boundary.



# Module Contract

Every module MUST have:

- *.repository.ts  → DB access only
- *.service.ts     → business logic
- *.server.ts      → auth + mapping
- *.actions.ts     → Next.js entry point

No layer may skip another layer.

---

## 9. Code Documentation & Commenting Contract (`Code-Documentation-Contract.md`)

# Code Documentation & Commenting Contract (Mandatory)

All code provided or written for this project MUST follow
a strict commenting and documentation standard.

This rule applies to:
- All modules
- All layers
- All future code provided by AI or humans

--------------------------------------------------
FILE-LEVEL COMMENT RULE (MANDATORY)
--------------------------------------------------

Every file MUST start with a clear file-level comment
explaining:

1. File path
2. Layer name
3. Purpose of the file
4. What this file is responsible for
5. What this file must NOT do

### Standard File Header Format

/***************************************************
 * File: modules/<module>/<file-name>.ts
 * Layer: <Model | Types | DTO | Repository | Service | Mapper | Controller | Action>
 *
 * Purpose:
 * - Clearly describe why this file exists
 *
 * Responsibilities:
 * - What this file is allowed to do
 *
 * Restrictions:
 * - What this file must NEVER do
 ***************************************************/




--------------------------------------------------
FUNCTION-LEVEL COMMENT RULE
--------------------------------------------------

Every exported function, method, or handler MUST have
a comment explaining:

1. What the function does
2. When it should be used
3. What it returns
4. What it does NOT handle (if applicable)



### Standard Function Comment Template


/**
 * Purpose:
 * - Describe the exact responsibility of this function
 *
 * Used By:
 * - Service / Controller / Action / Internal
 *
 * Returns:
 * - Describe return type in plain language
 *
 * Notes:
 * - Important constraints or assumptions
 */




--------------------------------------------------
CLASS-LEVEL COMMENT RULE
--------------------------------------------------

If a class is used, it MUST have a class-level comment
explaining:

1. Why a class is used instead of functions
2. What responsibilities the class owns
3. What it must not handle




/**
 * SocialService
 *
 * Purpose:
 * - Handles all business rules related to Social module
 *
 * Responsibilities:
 * - Validation
 * - Business decisions
 *
 * Restrictions:
 * - Must NOT format response
 * - Must NOT return DTOs
 * - Must NOT access HTTP or cookies
 */



--------------------------------------------------
LAYER-SPECIFIC COMMENT RULES
--------------------------------------------------

Repository:
- Must mention which DB operations are handled
- Must mention that no business logic exists here

Service:
- Must mention domain rules and validations
- Must clearly state "No response formatting"

Mapper:
- Must mention data transformation rules
- Must mention ObjectId → string and Date → ISO conversion

Controller / Action:
- Must mention request/response responsibility
- Must mention auth responsibility (if action)




--------------------------------------------------
FORBIDDEN PRACTICES
--------------------------------------------------

❌ Missing file-level comment  
❌ Vague comments like "helper file"  
❌ Comments that restate code line-by-line  
❌ Comments that explain obvious syntax  
❌ No-purpose comments



--------------------------------------------------
GOLDEN RULE
--------------------------------------------------

"If a new developer cannot understand the file’s purpose
within 10 seconds of reading the comments,
the comments are insufficient."



--------------------------------------------------
SCOPE OF THIS CONTRACT
--------------------------------------------------

This contract applies to:
- All backend modules inside `modules/`
- All repository, service, mapper, controller, and action files
- Shared backend utilities related to modules

This contract does NOT apply to:
- UI-only React components
- Pure styling files
- Auto-generated framework files


--------------------------------------------------
OBJECT-BASED LAYER EXPORT RULE
--------------------------------------------------

For Repository, Controller, and Server Facade layers:

- Export MUST be a named constant object
- Methods MUST use method shorthand syntax
- File-level comment MUST mention:
  "This file exports a stateless object with methods"

Example:

export const userRepository = {
  findById() {},
  create() {},
};

Classes are NOT allowed in these layers.


--------------------------------------------------
ENFORCEMENT RULE
--------------------------------------------------

Any code that does not follow this contract:
- Must be considered incomplete
- Must be revised before merging or usage
- Must not be accepted as final output



# Documentation Contract

Each file must clearly state:
- its layer
- what it is allowed to call
- what it must NOT call

Violation of layer rules is considered a bug.
