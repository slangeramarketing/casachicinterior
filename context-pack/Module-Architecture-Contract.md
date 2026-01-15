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
