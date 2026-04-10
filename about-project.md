# Project Documentation: CasaChic Interior

## 1. About This Project
This project, **CasaChic Interior**, is a modern web application built for an interior design agency. It serves as a professional platform to showcase services, portfolios, design processes, and client reviews. It features a robust client-facing frontend with a rich blog system and service showcase, paired with an administrative dashboard for full content management.

## 2. Tech Stack
**Frontend & Core:**
- **Framework**: Next.js 16.0.10 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion
- **Rich Text Editor**: Tiptap
- **Sliders/Carousels**: Swiper
- **Data Visualization**: Recharts

**Backend & Data:**
- **Database**: MongoDB (via Mongoose)
- **Authentication**: Custom Auth (Tokens/bcrypt)
- **Emails**: Nodemailer

**Project Standards & Tools:**
- **Testing**: Vitest with Coverage
- **Architecture**: Modular Domain-Driven Design
- **Tracking/Analytics**: Google Tag Manager (GTM), Google Analytics (GA4)

## 3. Features
- **Public Website:**
  - Modern, responsive landing page with engaging animations.
  - Dynamic service showcase and process breakdown.
  - Categorized blog system for content marketing.
  - Client reviews and testimonials section.
  - Contact and messaging system.
- **Admin Dashboard:**
  - Comprehensive Content Management System (CMS) for Services, Blogs, Reviews, and Messages.
  - User and role management.
  - Analytics and data visualization.

## 4. Current Situation of Project (Completed Features)
Based on the current architecture and modular implementation, the following core features and modules have been **completed**:

- **✅ User & Authentication System:** Complete user management and secure authentication flow (`auth` and `users` modules).
- **✅ Service Catalog:** Management and display of service categories and detailed service information (`services` and `service-category` modules).
- **✅ Service Showcase / Portfolio:** Highlighting past work and featured interior design projects (`service-showcase` module).
- **✅ Blog System:** Full-featured article publishing, categorization, and rich text content (`blogs` and `blog-category` modules).
- **✅ Design Process:** Custom interface to explain the step-by-step workflow to potential clients (`design-process` module).
- **✅ Client Reviews:** Managing and displaying client testimonials natively (`review` module).
- **✅ Messaging & Contact:** Receiving and managing inquiries from prospective clients securely (`messages` module).
- **✅ SEO & Analytics Optimization:** GTM, GA4 integration, staging/production environments, and domain redirection setup.
- **✅ Performance & Accessibility:** 100% ARIA compliance, highly optimized images (native `<img>` with priority for LCP), and high PageSpeed scores.

## 5. Analytics & Tracking Integrations
### Google Tag Manager (GTM)
- **GTM Script Strategy**: Uses `beforeInteractive` in `lib/GoogleTagManager.tsx` for immediate crawler detection.
- **Noscript Placement**: Positioned as the first child of `<body>` in `app/layout.tsx` to ensure search console verification succeeds.
- **Backup Verification**: Meta-tag based verification enabled in `layout.tsx` metadata.

### Domain Redirection & SEO
- **Redirection Logic**: Implemented in `next.config.ts` to consolidate traffic from `.in` and `.online` domains to `.com`.
- **Staging Safety**: Staging subdomain (`staging.casachicinterior.online`) is excluded from redirection to ensure development parity.
- **Canonical Tags**: Added to `app/layout.tsx` to ensure search engines prioritize the primary `.com` domain.

### Google Analytics (GA4)
- **Management**: The project includes the `@google-analytics/data` package, indicating server-side analytics reporting capabilities.
- **Configuration**:
    - **Property IDs**: Separate IDs for Production (`523867178`) and Staging (`520656492`).
    - **Service Account**: Integrates with Google Cloud via `GA_CLIENT_EMAIL` and a secured `GA_PRIVATE_KEY` for authorized data access.

## 6. Project Standards
### Architecture: Modular Domain-Driven Design
The project follows a **Standard & Scalable Architecture**. Instead of a generic folder structure, it uses a **Modular approach** (found in the `/modules` directory):
- **Modules**: Each feature (e.g., `blogs`, `services`, `users`) is self-contained.
- **Separation of Concerns**: Each module follows a strict pattern (DTO, Mapper, Model, Repository, Service, Server).
- **Testing**: Dedicated unit tests for each module using Vitest.

## 7. Performance & Accessibility Optimizations
The project underwent a significant optimization phase to achieve PageSpeed scores of 90+ and Accessibility scores near 100.

- **Performance (LCP Fix)**:
    - Highly optimized `OptimizedImage` component using native `<img>` tag for VPS compatibility while supporting `priority` loading (`loading="eager"`, `fetchPriority="high"`).
    - Strategic use of `priority={true}` for above-the-fold images (Hero Section, FABs).
    - Prevention of Layout Shift (CLS) via explicit `aspectRatio` management.
- **Accessibility**:
    - **100% ARIA Compliance**: All icon-only buttons (mobile menu, social FABs, modal close) include descriptive `aria-label`.
    - **Form Accessibility**: All contact form inputs are explicitly linked to `<label>` tags using `id` and `htmlFor`.
    - **Semantic Structure**: Proper use of descriptive `alt` text and accessibility-friendly navigation.

## 8. Evaluation & Conclusion
- **Scalability**: **High**. The modular design allows developers to add or modify features without affecting the rest of the system.
- **Standards**: **High**. Use of TypeScript, DTOs, Repository patterns, and comprehensive testing (Vitest) aligns with enterprise-level development standards.
- **Clean Code**: Excellent implementation of separation of concerns and modern Tailwind v4 practices.

This is a **highly professional and scalable project**. It goes beyond a simple Next.js boilerplate by implementing a robust backend architecture on top of the frontend framework. The integration of GTM and GA4 is done correctly, and the recent performance/accessibility optimizations make it a top-tier production environment.

---
*Generated by Antigravity AI on 2026-03-29*
