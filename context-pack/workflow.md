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
