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
