export type Project = {
  id: number;
  title: string;
  slug:string
  shortDescription: string;
  overview: string;

  location: string;
  category: string;
  duration: string;
  status: string;
  executionModel: string;
  qualityAssurance: string;

  startDate: string;
  endDate: string;

  featured: boolean;

  coverImage: string;
  galleryImages: string[];

  materials: {
    icon: string;
    text: string;
  }[];

  workforce: {
    icon: string;
    label: string;
    value: string;
  }[];
};

export const projects: Project[] = [
  {
    id: 1,
    title: "Modern 3BHK Apartment – Delhi",
    slug:"modern-3bhk-apartment-delhi",
    shortDescription:
      "Contemporary residential interior focused on comfort and smart space utilization.",

    overview:
      "This residential project was designed to balance modern aesthetics with everyday functionality. The layout was optimized to improve movement, storage, and natural lighting while maintaining a warm and elegant home environment.",

    location: "Delhi NCR, India",
    category: "Residential Interior",
    duration: "Completed in 45 Days",
    status: "Successfully Delivered",
    executionModel: "Turnkey Residential Execution",
    qualityAssurance: "Stage-wise Quality Inspection",

    startDate: "05 Jan 2025",
    endDate: "18 Feb 2025",

    featured: true,

    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",

    galleryImages: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    ],

    materials: [
      { icon: "FiLayers", text: "BWP-grade plywood for core furniture" },
      { icon: "FiFeather", text: "Laminate and PU finish surfaces" },
      { icon: "FiSun", text: "Warm LED ambient lighting" },
      { icon: "FiTool", text: "Soft-close branded hardware fittings" },
    ],

    workforce: [
      { icon: "FiUsers", label: "Total Workforce", value: "10 Professionals" },
      { icon: "FiScissors", label: "Carpenters", value: "4 Specialists" },
      { icon: "FiZap", label: "Electricians", value: "2 Technicians" },
      { icon: "FiEdit3", label: "Painters", value: "3 Finishers" },
      { icon: "FiShield", label: "Site Supervisor", value: "1 Lead" },
    ],
  },

  {
    id: 2,
    title: "Luxury Office Interior – Noida",
    slug:"luxury-office-interior-noida",
    shortDescription:
      "Premium workspace designed for productivity, comfort, and brand identity.",

    overview:
      "This project involved the complete transformation of a commercial office space into a modern, high-performance work environment with a focus on efficiency, branding, and long-term durability.",

    location: "Noida Sector-62, India",
    category: "Commercial Office Interior",
    duration: "Completed in 30 Days",
    status: "Successfully Delivered",
    executionModel: "End-to-End Turnkey Execution",
    qualityAssurance: "Multiple Stage Quality Checks",

    startDate: "12 Oct 2025",
    endDate: "12 Dec 2025",

    featured: true,

    coverImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",

    galleryImages: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea",
    ],

    materials: [
      { icon: "FiLayers", text: "BWP-grade plywood for structural strength" },
      { icon: "FiFeather", text: "Premium laminate and PU finishes" },
      { icon: "FiGrid", text: "Modular workstations and storage" },
      { icon: "FiSun", text: "Concealed LED lighting system" },
      { icon: "FiTool", text: "Branded hardware fittings" },
    ],

    workforce: [
      { icon: "FiUsers", label: "Total Workforce", value: "12 Professionals" },
      { icon: "FiScissors", label: "Carpenters", value: "5 Specialists" },
      { icon: "FiZap", label: "Electricians", value: "2 Certified Experts" },
      { icon: "FiEdit3", label: "Painters & Finishers", value: "3 Specialists" },
      { icon: "FiShield", label: "Site Supervisor", value: "1 Dedicated Lead" },
    ],
  },

  {
    id: 3,
    title: "Minimalist Villa Interior – Noida",
    slug:"minimalist-villa-interior-noida",
    shortDescription:
      "Luxury villa interior with minimalist design and natural light focus.",

    overview:
      "Designed for modern family living, this villa interior emphasizes clean lines, open spaces, and a calm visual language while ensuring premium materials and long-term durability.",

    location: "Noida Sector-62, India",
    category: "Residential Villa Interior",
    duration: "Completed in 60 Days",
    status: "Successfully Delivered",
    executionModel: "Custom Design & Build",
    qualityAssurance: "Material & Finish Validation",

    startDate: "01 Feb 2025",
    endDate: "02 Apr 2025",

    featured: false,

    coverImage:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1600&q=80",

    galleryImages: [
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab",
      "https://images.unsplash.com/photo-1618220179428-22790b461013",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
    ],

    materials: [
      { icon: "FiFeather", text: "Matte PU and veneer finishes" },
      { icon: "FiSun", text: "Natural and indirect lighting setup" },
      { icon: "FiTool", text: "Premium imported hardware" },
    ],

    workforce: [
      { icon: "FiUsers", label: "Total Workforce", value: "14 Professionals" },
      { icon: "FiScissors", label: "Carpenters", value: "6 Specialists" },
      { icon: "FiZap", label: "Electricians", value: "3 Technicians" },
      { icon: "FiShield", label: "Site Supervisor", value: "1 Lead" },
    ],
  },

  {
    id: 4,
    title: "Startup Office Interior – Bangalore",
    slug:"startup-office-interior-bangalore",
    shortDescription:
      "Modern startup workspace designed for collaboration and flexibility.",

    overview:
      "This office interior was planned to support fast-growing startup teams, with open collaboration zones, efficient workstations, and a youthful design language.",

    location: "Delhi NCR, India",
    category: "Office Interior",
    duration: "Completed in 25 Days",
    status: "Successfully Delivered",
    executionModel: "Fast-Track Execution",
    qualityAssurance: "On-site Quality Supervision",

    startDate: "10 Mar 2025",
    endDate: "04 Apr 2025",

    featured: false,

    coverImage:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80",

    galleryImages: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
      "https://images.unsplash.com/photo-1556761175-4b46a572b786",
    ],

    materials: [
      { icon: "FiGrid", text: "Modular desks and seating systems" },
      { icon: "FiSun", text: "Energy-efficient LED lighting" },
      { icon: "FiTool", text: "Durable commercial-grade fittings" },
    ],

    workforce: [
      { icon: "FiUsers", label: "Total Workforce", value: "9 Professionals" },
      { icon: "FiScissors", label: "Carpenters", value: "3 Specialists" },
      { icon: "FiZap", label: "Electricians", value: "2 Technicians" },
      { icon: "FiShield", label: "Site Supervisor", value: "1 Lead" },
    ],
  },

  {
    id: 5,
    title: "Premium Home Interior – Noida",
    slug:"premium-home-interior-noida",
    shortDescription:
      "Elegant residential interior combining luxury finishes with practicality.",

    overview:
      "This premium home interior project focused on blending luxury materials with functional layouts to create a refined yet comfortable living space.",

    location: "Delhi NCR, India",
    category: "Residential Interior",
    duration: "Completed in 50 Days",
    status: "Successfully Delivered",
    executionModel: "Design & Build Model",
    qualityAssurance: "Finish-Level Quality Control",

    startDate: "15 Jan 2025",
    endDate: "05 Mar 2025",

    featured: false,

    coverImage:
      "https://images.unsplash.com/photo-1721614464891-0c21eb7d71b1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UHJlbWl1bSUyMEhvbWUlMjBJbnRlcmlvciUyMGZyZWUlMjBpbWFnZXN8ZW58MHx8MHx8fDI%3D",

    galleryImages: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace",
    ],

    materials: [
      { icon: "FiLayers", text: "High-grade plywood and veneer panels" },
      { icon: "FiFeather", text: "Luxury laminate finishes" },
      { icon: "FiTool", text: "Premium branded hardware" },
    ],

    workforce: [
      { icon: "FiUsers", label: "Total Workforce", value: "11 Professionals" },
      { icon: "FiScissors", label: "Carpenters", value: "4 Specialists" },
      { icon: "FiZap", label: "Electricians", value: "2 Technicians" },
      { icon: "FiEdit3", label: "Painters", value: "3 Finishers" },
      { icon: "FiShield", label: "Site Supervisor", value: "1 Lead" },
    ],
  },{
  id: 6,
  title: "Complete Home Renovation – Gurgaon",
  slug: "complete-home-renovation-gurgaon",
  shortDescription:
    "End-to-end home renovation transforming an outdated apartment into a modern, functional living space.",

  overview:
    "This home renovation project focused on upgrading interiors, improving space efficiency, and modernizing finishes. The scope included civil modifications, electrical and plumbing upgrades, new flooring, modular furniture integration, and contemporary lighting to deliver a fresh, premium look.",

  location: "Gurgaon, Haryana, India",
  category: "Home Renovation",
  duration: "Completed in 55 Days",
  status: "Successfully Delivered",
  executionModel: "Turnkey Renovation Execution",
  qualityAssurance: "Stage-wise Quality & Safety Checks",

  startDate: "10 Feb 2025",
  endDate: "05 Apr 2025",

  featured: true,

  coverImage:
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=80",

  galleryImages: [
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
    "https://images.unsplash.com/photo-1600585154084-4e5b1e8b5f8c",
    "https://images.unsplash.com/photo-1600607688061-1c7c60cdbb6a",
  ],

  materials: [
    { icon: "FiLayers", text: "Vitrified flooring and anti-skid bathroom tiles" },
    { icon: "FiTool", text: "Upgraded plumbing and concealed wiring" },
    { icon: "FiSun", text: "Energy-efficient LED lighting" },
    { icon: "FiFeather", text: "Premium wall finishes and textures" },
  ],

  workforce: [
    { icon: "FiUsers", label: "Total Workforce", value: "13 Professionals" },
    { icon: "FiScissors", label: "Carpenters", value: "4 Specialists" },
    { icon: "FiZap", label: "Electricians", value: "3 Technicians" },
    { icon: "FiEdit3", label: "Painters", value: "4 Finishers" },
    { icon: "FiShield", label: "Site Supervisor", value: "1 Lead" },
  ],
  },
  {
  id: 7,
  title: "Modular Kitchen & Wardrobe Interior – Noida",
  slug: "modular-kitchen-wardrobe-interior-noida",
  shortDescription:
    "Modern modular kitchen and wardrobe interiors designed for efficiency, storage, and aesthetics.",

  overview:
    "This modular interior project included a fully modular kitchen and custom wardrobes for bedrooms. The design emphasized space optimization, ease of maintenance, and long-term durability using factory-finished modules and premium hardware.",

  location: "Noida Sector-75, India",
  category: "Modular Interior",
  duration: "Completed in 28 Days",
  status: "Successfully Delivered",
  executionModel: "Factory-Finished Modular Execution",
  qualityAssurance: "Module-Level & Installation Quality Checks",

  startDate: "18 Mar 2025",
  endDate: "14 Apr 2025",

  featured: true,

  coverImage:
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",

  galleryImages: [
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
    "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f1",
    "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
  ],

  materials: [
    { icon: "FiLayers", text: "BWP-grade plywood carcass" },
    { icon: "FiTool", text: "Soft-close hinges and branded channels" },
    { icon: "FiFeather", text: "Matte laminate and acrylic finishes" },
    { icon: "FiGrid", text: "Modular storage accessories" },
  ],

  workforce: [
    { icon: "FiUsers", label: "Total Workforce", value: "8 Professionals" },
    { icon: "FiScissors", label: "Carpenters", value: "3 Specialists" },
    { icon: "FiZap", label: "Electricians", value: "2 Technicians" },
    { icon: "FiShield", label: "Installation Supervisor", value: "1 Lead" },
  ],
 },


];

 