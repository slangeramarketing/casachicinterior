/* -------------------------------------
   TYPES (MATCHING SCHEMA)
------------------------------------- */
export interface IncludeItem {
  image: string;
  title: string;
}

export interface ProcessStep {
  icon: string; // react-icons name
  step: number;
  title: string;
  description: string;
}

export interface ServiceData {
  id: number; // 👈 ADD THIS
  title: string;
  slug: string;

  shortDescription: string;
  overview: string;

  coverImage: string;
  galleryImages: string[];

  includes: IncludeItem[];
  processSteps: ProcessStep[];

  featured: boolean;
  isActive: boolean;

  seo: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

/* -------------------------------------
   SERVICES DATA (5 REAL SERVICES)
------------------------------------- */
export const servicesData: ServiceData[] = [
  /* =====================================================
     1. MODULAR INTERIOR
  ===================================================== */
  {
    id: 1,
    title: "Modular Interior Design",
    slug: "modular-interior-design",

    shortDescription:
      "Smart, space-efficient modular interior solutions with premium finishes and modern aesthetics.",

    overview:
      "Our Modular Interior service delivers factory-finished, precision-crafted interior solutions that ensure faster execution, minimal on-site work, and long-lasting durability. Ideal for kitchens, wardrobes, TV units, and complete home interiors.",

    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",

    galleryImages: [
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    ],

    includes: [
      {
        image:
          "https://images.unsplash.com/photo-1588854337115-1c67d9247e4d",
        title: "Factory-Finished Modules",
      },
      {
        image:
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
        title: "Premium Hardware & Accessories",
      },
      {
        image:
          "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
        title: "10-Year Durability Assurance",
      },
    ],

    processSteps: [
      {
        icon: "FiEdit",
        step: 1,
        title: "Design Consultation",
        description:
          "Understand client needs, layout planning, and material selection.",
      },
      {
        icon: "FiLayers",
        step: 2,
        title: "3D Visualization",
        description:
          "Photorealistic designs to finalize layout and finishes.",
      },
      {
        icon: "FiTool",
        step: 3,
        title: "Factory Manufacturing",
        description:
          "Precision manufacturing with strict quality control.",
      },
      {
        icon: "FiCheckCircle",
        step: 4,
        title: "Installation & Handover",
        description:
          "Quick installation with minimal disruption.",
      },
    ],

    featured: true,
    isActive: true,

    seo: {
      metaTitle: "Modular Interior Design Services",
      metaDescription:
        "Premium modular interior solutions with modern design and fast execution.",
    },
  },

  /* =====================================================
     2. HOME INTERIOR
  ===================================================== */
  {
    id: 2,
    title: "Complete Home Interior",
    slug: "complete-home-interior",

    shortDescription:
      "End-to-end home interior solutions blending comfort, elegance, and functionality.",

    overview:
      "Our Complete Home Interior service covers every aspect of your living space — from living rooms and bedrooms to kitchens and bathrooms — ensuring a cohesive design language and superior craftsmanship.",

    coverImage:
      "https://images.unsplash.com/photo-1723110994499-df46435aa4b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Q29tcGxldGUlMjBIb21lJTIwSW50ZXJpb3IlMjBpbmRpYW58ZW58MHx8MHx8fDA%3D",

    galleryImages: [
      "https://images.unsplash.com/photo-1600585154084-4e5b1e8b5f8c",
      "https://images.unsplash.com/photo-1714425341725-b7d9825f6e83?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RmFsc2UlMjBDZWlsaW5nJTIwJTI2JTIwTGlnaHRpbmd8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
    ],

    includes: [
      {
        image:
          "https://images.unsplash.com/photo-1618220179428-22790b461013",
        title: "Living & Bedroom Interiors",
      },
      {
        image:
          "https://images.unsplash.com/photo-1714425341725-b7d9825f6e83?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RmFsc2UlMjBDZWlsaW5nJTIwJTI2JTIwTGlnaHRpbmd8ZW58MHx8MHx8fDA%3D",
        title: "False Ceiling & Lighting",
      },
      {
        image:
          "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
        title: "Custom Furniture Design",
      },
    ],

    processSteps: [
      {
        icon: "FiHome",
        step: 1,
        title: "Requirement Analysis",
        description:
          "Lifestyle-based planning and space assessment.",
      },
      {
        icon: "FiPenTool",
        step: 2,
        title: "Design & Material Selection",
        description:
          "Theme-based design with premium materials.",
      },
      {
        icon: "FiSettings",
        step: 3,
        title: "Execution",
        description:
          "On-site execution with quality supervision.",
      },
      {
        icon: "FiSmile",
        step: 4,
        title: "Final Styling",
        description:
          "Finishing touches and client walkthrough.",
      },
    ],

    featured: true,
    isActive: true,

    seo: {
      metaTitle: "Complete Home Interior Design",
      metaDescription:
        "Elegant and functional home interior solutions tailored to your lifestyle.",
    },
  },

  /* =====================================================
     3. HOME RENOVATION
  ===================================================== */
  {
    id: 3,
    title: "Home Renovation",
    slug: "home-renovation",

    shortDescription:
      "Transform your existing home with modern design upgrades and structural improvements.",

    overview:
      "Our Home Renovation service revitalizes old or outdated spaces through smart redesign, structural upgrades, and modern finishes — without compromising comfort or safety.",

    coverImage:
      "https://images.unsplash.com/photo-1571843439991-dd2b8e051966?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEhvbWUlMjBSZW5vdmF0aW9ufGVufDB8fDB8fHww",

    galleryImages: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
      "https://images.unsplash.com/photo-1600573472591-ee6981cf6c86",
    ],

    includes: [
      {
        image:
          "https://images.unsplash.com/photo-1581674662583-5e89b374fae6?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Civil & Structural Work",
      },
      {
        image:
          "https://images.unsplash.com/photo-1687179185557-81b3e47cac26?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWxlY3RyaWNhbCUyMCUyNiUyMHBsdW1iaW5nJTIwdXBncmFkJTIwZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8Mg%3D%3D",
        title: "Electrical & Plumbing Upgrade",
      },
      {
        image:
          "https://images.unsplash.com/photo-1713283365745-a727fb26c52f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TW9kZXJuJTIwSW50ZXJpb3IlMjBGaW5pc2hlcyUyMGZyZWUlMjBpbWFnZXN8ZW58MHx8MHx8fDI%3D",
        title: "Modern Interior Finishes",
      },
    ],

    processSteps: [
      {
        icon: "FiSearch",
        step: 1,
        title: "Site Inspection",
        description:
          "Detailed assessment of existing conditions.",
      },
      {
        icon: "FiClipboard",
        step: 2,
        title: "Renovation Planning",
        description:
          "Scope definition, timeline, and budget planning.",
      },
      {
        icon: "FiTool",
        step: 3,
        title: "Execution",
        description:
          "Step-by-step renovation with safety checks.",
      },
      {
        icon: "FiThumbsUp",
        step: 4,
        title: "Completion",
        description:
          "Quality inspection and handover.",
      },
    ],

    featured: false,
    isActive: true,

    seo: {
      metaTitle: "Home Renovation Services",
      metaDescription:
        "Expert home renovation solutions for modern living.",
    },
  },

  /* =====================================================
     4. COMMERCIAL SPACES
  ===================================================== */
  {
    id: 4,
    title: "Commercial Interior Spaces",
    slug: "commercial-interior-spaces",

    shortDescription:
      "Professional interior solutions for offices, retail stores, and commercial environments.",

    overview:
      "We design and execute commercial interiors that enhance productivity, brand identity, and customer experience — from corporate offices to retail outlets and showrooms.",

    coverImage:
      "https://images.unsplash.com/photo-1700809888987-cf2b29ecbd2c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

    galleryImages: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0",
    ],

    includes: [
      {
        image:
          "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
        title: "Office & Workspace Design",
      },
      {
        image:
          "https://images.unsplash.com/photo-1497366216548-37526070297c",
        title: "Retail & Showroom Interiors",
      },
      {
        image:
          "https://images.unsplash.com/photo-1557804506-669a67965ba0",
        title: "Brand-Focused Layout Planning",
      },
    ],

    processSteps: [
      {
        icon: "FiBriefcase",
        step: 1,
        title: "Business Requirement Study",
        description:
          "Understanding workflow and brand goals.",
      },
      {
        icon: "FiGrid",
        step: 2,
        title: "Space Planning",
        description:
          "Efficient layout for maximum productivity.",
      },
      {
        icon: "FiActivity",
        step: 3,
        title: "Execution",
        description:
          "Fast-track commercial execution.",
      },
      {
        icon: "FiAward",
        step: 4,
        title: "Project Delivery",
        description:
          "Timely completion with quality assurance.",
      },
    ],

    featured: true,
    isActive: true,

    seo: {
      metaTitle: "Commercial Interior Design Services",
      metaDescription:
        "High-performance commercial interior solutions for modern businesses.",
    },
  },

  /* =====================================================
     5. CUSTOM INTERIOR SOLUTIONS
  ===================================================== */
  {
    id: 5,
    title: "Custom Interior Solutions",
    slug: "custom-interior-solutions",

    shortDescription:
      "Tailor-made interior designs crafted to match unique tastes and requirements.",

    overview:
      "Our Custom Interior Solutions service is designed for clients who want personalized layouts, bespoke furniture, and exclusive finishes that reflect their individuality.",

    coverImage:
      "https://images.unsplash.com/photo-1729019756193-86b498740600?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI2fHx8ZW58MHx8fHx8",

    galleryImages: [
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
      "https://images.unsplash.com/photo-1600566752734-2e8d9a3a3f63",
      "https://images.unsplash.com/photo-1600607688061-1c7c60cdbb6a",
    ],

    includes: [
      {
        image:
          "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
        title: "Bespoke Furniture Design",
      },
      {
        image:
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
        title: "Exclusive Material Selection",
      },
      {
        image:
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
        title: "Personal Design Consultant",
      },
    ],

    processSteps: [
      {
        icon: "FiUser",
        step: 1,
        title: "Client Consultation",
        description:
          "Deep understanding of style and preferences.",
      },
      {
        icon: "FiFeather",
        step: 2,
        title: "Concept Development",
        description:
          "Unique design concepts and mockups.",
      },
      {
        icon: "FiPackage",
        step: 3,
        title: "Custom Production",
        description:
          "Handcrafted elements and finishes.",
      },
      {
        icon: "FiHeart",
        step: 4,
        title: "Final Reveal",
        description:
          "Exclusive interiors delivered to perfection.",
      },
    ],

    featured: false,
    isActive: true,

    seo: {
      metaTitle: "Custom Interior Design Solutions",
      metaDescription:
        "Personalized interior solutions crafted for unique spaces.",
    },
  },
];
