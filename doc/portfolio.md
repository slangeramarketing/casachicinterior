# Casa Chic Interior - Project Portfolio Documentation

This document provides a comprehensive overview of the Casa Chic Interior web application, covering its architecture, data flow, database structure, and design system.

---

## 🏗️ Project Architecture

The application is built using a **Modular Layered Architecture** with Next.js 16 (App Router). It separates concerns into domain-specific modules, ensuring scalability and maintainability.

### Core Tech Stack
- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, Framer Motion.
- **Backend**: Next.js Server Actions, Server Components, API Routes.
- **Database**: MongoDB with Mongoose ODM.
- **Authentication**: JWT & Bcrypt based custom authentication.
- **Communication**: WhatsApp Business Integration, Nodemailer.

### Directory Structure
```text
/
├── app/              # Next.js App Router (Routes & Server/Client Components)
├── modules/          # Domain Logic (The Core Engine)
│   ├── auth/         # Login, Session & JWT logic
│   ├── users/        # User management
│   ├── blogs/        # Blog engine
│   ├── services/     # Service management
│   └── messages/     # Inquiry & Contact logic
├── components/       # Reusable UI components (buttons, cards, banners)
├── lib/              # Shared utilities (db connection, helper functions)
├── public/           # Static assets (images, icons, manifest)
└── doc/              # Documentation
```

### Layered Approach (Inside Modules)
1. **Model Layer** (`*.model.ts`): Defines the Mongoose schema.
2. **Repository Layer** (`*.repository.ts`): Directly interacts with the database.
3. **Service Layer** (`*.service.ts`): Handles business logic and orchestration.
4. **Server Facade** (`*.server.ts`): A clean interface for Server Components.
5. **Controller Layer** (`*.controller.ts`): Handles validation and request/response mapping.
6. **Mapper/DTO Layer**: Transforms data between DB and UI formats.

---

## 🔄 Data Flow

The application follows a predictable data flow pattern to handle both user interactions and data rendering.

### 1. Data Retrieval (Read Flow)
- **User Request** → **App Router (Server Component)**.
- **Server Component** calls the **Service Facade** (`*.server.ts`).
- **Service** requests data from the **Repository**.
- **Repository** fetches from **Mongoose/MongoDB**.
- **Mapper** converts the DB Document into a clean **DTO** (Data Transfer Object).
- **UI** renders the data safely.

### 2. Data Modification (Write Flow)
- **User Action** → **Admin Form (Client Component)**.
- **Client Component** triggers a **Server Action** (`*.action.ts`).
- **Server Action** validates the request and calls the **Service**.
- **Service** processes business rules and calls **Repository**.
- **Repository** updates **MongoDB**.
- `revalidatePath` or `redirect` is used to update the UI.

---

## 🗄️ Database Tables (Mongoose Collections)

While MongoDB is NoSQL, the application maintains structured collections:

| Collection Name | Purpose | Key Fields |
| :--- | :--- | :--- |
| **Users** | System Administrators | `name`, `email`, `password`, `role`, `status` |
| **Blogs** | Article Management | `title`, `slug`, `content`, `author`, `category` |
| **BlogCategories**| Taxonomic organization | `name`, `slug`, `description` |
| **Services** | Interior Design Offerings| `title`, `slug`, `description`, `priceRange` |
| **ServiceShowcase** | Portfolios per service | `title`, `images`, `serviceId` |
| **Messages** | User inquiries/Contacts | `name`, `phone`, `message`, `status` |
| **Reviews** | Customer Testimonials | `customerName`, `rating`, `comment`, `isApproved` |

---

## 🎨 Design System & Color Theme

The visual identity is defined using Tailwind CSS variables in `globals.css`, ensuring consistent branding across the platform.

### Primary Color Tokens
- **Primary (Orange)**: `#F97316` — Used for main actions, CTAs, and branding.
- **Secondary (Light)**: `#F2F2F2` — Used for secondary backgrounds and sections.
- **Accent (Hover)**: `#DD5E06` — Deep orange for interactive hover states.
- **Background**: `#FFFFFF` (Light Mode) / `#171717` (Dark Text / Overlay).

### Typography
- **Headings**: Modern sans-serif with bold weights.
- **Body**: Clean, high-readability sans-serif fonts.

---

## 🚀 Deployment Architecture
- **Environment**: Linux VPS (Ubuntu).
- **Process Manager**: **PM2** (Process monitoring and zero-downtime restarts).
- **Reverse Proxy**: **Nginx** (SSL termination and domain routing).
- **CI/CD**: **GitHub Actions** (Manual push to staging server).
- **PWA Support**: Offline capabilities and mobile-first experience.
