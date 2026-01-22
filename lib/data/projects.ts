export type Project = {
  id: number;
  title: string;
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
    title: "Modern 3BHK Apartment – Patna",
    shortDescription:
      "Contemporary residential interior focused on comfort and smart space utilization.",

    overview:
      "This residential project was designed to balance modern aesthetics with everyday functionality. The layout was optimized to improve movement, storage, and natural lighting while maintaining a warm and elegant home environment.",

    location: "Patna, India",
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
    title: "Luxury Office Interior – Delhi",
    shortDescription:
      "Premium workspace designed for productivity, comfort, and brand identity.",

    overview:
      "This project involved the complete transformation of a commercial office space into a modern, high-performance work environment with a focus on efficiency, branding, and long-term durability.",

    location: "Delhi, India",
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
    shortDescription:
      "Luxury villa interior with minimalist design and natural light focus.",

    overview:
      "Designed for modern family living, this villa interior emphasizes clean lines, open spaces, and a calm visual language while ensuring premium materials and long-term durability.",

    location: "Noida, India",
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
    shortDescription:
      "Modern startup workspace designed for collaboration and flexibility.",

    overview:
      "This office interior was planned to support fast-growing startup teams, with open collaboration zones, efficient workstations, and a youthful design language.",

    location: "Bangalore, India",
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

 
];

