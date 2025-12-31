app/
├── (public)/
│   ├── page.jsx              # Landing page
│   ├── about/
│   │   └── page.jsx
│   
│   
│
├── (admin)/
│   ├── layout.jsx            # Admin layout
│   ├── dashboard/
│   │   └── page.jsx
│   
│   
│
├── api/
│   ├── projects/
│   │   └── route.js
│   ├── contact/
│   │   └── route.js
│
modules/
├── project/
│   ├── project.model.js
│   ├── project.service.js
│   ├── project.controller.js
│   ├── project.validation.js
│   └── project.constants.js
│
├── contact/
│   ├── contact.model.js
│   ├── contact.service.js
│   ├── contact.controller.js
│   └── contact.validation.js
│
├── auth/
│   ├── auth.model.js
│   ├── auth.service.js
│   ├── auth.controller.js
│   └── auth.middleware.js
│
├── review/
│   ├── review.model.js
│   ├── review.service.js
│   └── review.controller.js
lib/
├── db.js              # MongoDB connection
├── response.js        # Standard API responses
├── error.js           # Custom error handler
├── auth.js            # JWT / session helpers
└── helpers.js
|
├── layout.jsx                # Root layout
├── globals.css
|── not-found.jsx
|



app/api/auth/
├── register/route.ts
├── login/route.ts
├── update/route.ts
└── delete/route.ts
