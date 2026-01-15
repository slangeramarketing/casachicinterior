Canonical Project Structure:

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
