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



