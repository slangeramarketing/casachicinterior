/* -------------------------------------
   Types
------------------------------------- */
export type ServiceCategory =
  | "Residential Interior"
  | "Commercial Interior"
  | "Turnkey Solutions"
  | "Custom & Specialized"
  | "Design Consultancy";

export interface Service {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: ServiceCategory;

  coverImage: string;

  highlights: string[]; // key selling points
  deliverables: string[]; // what client gets

  featured?: boolean;
}

/* -------------------------------------
   Categories (for slider)
------------------------------------- */
export const serviceCategories: ServiceCategory[] = [
  "Residential Interior",
  "Commercial Interior",
  "Turnkey Solutions",
  "Custom & Specialized",
  "Design Consultancy",
];

/* -------------------------------------
   Services Data
------------------------------------- */
export const services: Service[] = [
  {
    id: 1,
    slug: "complete-home-interior",
    title: "Complete Home Interior Design",
    shortDescription:
      "End-to-end interior design and execution for modern homes.",
    description:
      "We provide complete home interior solutions including planning, design, material selection, execution, and final handover with strict quality control.",
    category: "Residential Interior",
    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Personalized design concepts",
      "Premium branded materials",
      "Timely project delivery",
    ],
    deliverables: [
      "Design & space planning",
      "Material selection",
      "Execution & supervision",
      "Final handover",
    ],
    featured: true,
  },
  {
    id: 2,
    slug: "modular-kitchen-design",
    title: "Modular Kitchen Design",
    shortDescription:
      "Smart, functional, and stylish modular kitchen solutions.",
    description:
      "Our modular kitchens focus on efficiency, smart storage, and modern aesthetics using high-quality hardware and durable finishes.",
    category: "Residential Interior",
    coverImage:
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Ergonomic layouts",
      "High-quality hardware",
      "Easy maintenance",
    ],
    deliverables: [
      "Kitchen layout planning",
      "Cabinet & storage design",
      "Installation & finishing",
    ],
  },
  {
    id: 3,
    slug: "office-interior-design",
    title: "Office Interior Design",
    shortDescription:
      "Productivity-driven office interiors for growing businesses.",
    description:
      "We design office spaces that enhance productivity, employee comfort, and brand identity while ensuring durability and cost efficiency.",
    category: "Commercial Interior",
    coverImage:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Brand-aligned design",
      "Efficient workspace planning",
      "Commercial-grade materials",
    ],
    deliverables: [
      "Space planning",
      "Interior design",
      "Execution & quality checks",
    ],
    featured: true,
  },
  {
    id: 4,
    slug: "turnkey-interior-solution",
    title: "Turnkey Interior Solutions",
    shortDescription:
      "Complete interior execution with zero client stress.",
    description:
      "From concept to completion, we manage design, materials, labor, and execution under a single contract with transparent pricing.",
    category: "Turnkey Solutions",
    coverImage:
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Single-point responsibility",
      "Dedicated project management",
      "On-time delivery",
    ],
    deliverables: [
      "Design & planning",
      "Complete execution",
      "Project management",
      "Final handover",
    ],
  },
  {
    id: 5,
    slug: "3d-design-visualization",
    title: "3D Design & Visualization",
    shortDescription:
      "Photorealistic 3D designs to visualize your space.",
    description:
      "We create realistic 3D renders that help clients clearly visualize layouts, materials, and finishes before execution begins.",
    category: "Design Consultancy",
    coverImage:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "High-quality realistic renders",
      "Better design clarity",
      "Reduced revision risk",
    ],
    deliverables: [
      "3D renders",
      "Layout visualization",
      "Material & color suggestions",
    ],
  },
];

