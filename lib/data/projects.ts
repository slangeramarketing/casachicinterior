// this file location: @/lib/data/projects.ts

export type Project = {
  id: number;
  slug:string;
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
  
  video?: string;

  materials: {
    icon?: string;
    text: string;
    brand?: string;
    domain?: string;
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
    slug:"modern-3bhk-apartment-patna",
    title: "Modern 3BHK Apartment – Patna",
    shortDescription: "Contemporary residential interior focused on comfort and smart space utilization.",
    overview: "This residential project was designed to balance modern aesthetics with everyday functionality. The layout was optimized to improve movement, storage, and natural lighting while maintaining a warm and elegant home environment.",
    location: "Patna, India",
    category: "Residential Interior",
    duration: "Completed in 45 Days",
    status: "Successfully Delivered",
    executionModel: "Turnkey Residential Execution",
    qualityAssurance: "Stage-wise Quality Inspection",
    startDate: "05 Jan 2025",
    endDate: "18 Feb 2025",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
    ],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    materials: [
      { text: "Plywood", brand: "CenturyPly", domain: "centuryply.com" },
      { text: "Hardware", brand: "Hettich", domain: "hettich.com" },
      { text: "Paint", brand: "Asian Paints", domain: "asianpaints.com" },
      { text: "Laminates", brand: "Merino", domain: "merinolaminates.com" },
      { text: "Lighting", brand: "Havells", domain: "havells.com" },
      { text: "Bath Fittings", brand: "Jaquar", domain: "jaquar.com" },
      { text: "Tiles", brand: "Kajaria", domain: "kajariaceramics.com" },
      { text: "Switches", brand: "Philips", domain: "philips.com" }
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
    slug:"luxury-office-interior-delhi",
    title: "Luxury Office Interior – Delhi",
    shortDescription: "Premium workspace designed for productivity, comfort, and brand identity.",
    overview: "This project involved the complete transformation of a commercial office space into a modern, high-performance work environment with a focus on efficiency, branding, and long-term durability.",
    location: "Delhi, India",
    category: "Commercial Office Interior",
    duration: "Completed in 30 Days",
    status: "Successfully Delivered",
    executionModel: "End-to-End Turnkey Execution",
    qualityAssurance: "Multiple Stage Quality Checks",
    startDate: "12 Oct 2025",
    endDate: "12 Dec 2025",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea",
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800"
    ],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    materials: [
      { text: "Acoustic Panels", brand: "Armstrong", domain: "armstrongceilings.com" },
      { text: "Chairs", brand: "Herman Miller", domain: "hermanmiller.com" },
      { text: "Glass", brand: "Saint-Gobain", domain: "saint-gobain.com" },
      { text: "Flooring", brand: "Interface", domain: "interface.com" },
      { text: "Furniture", brand: "Godrej", domain: "godrejinterio.com" },
      { text: "Lighting", brand: "Wipro", domain: "wiprolighting.com" },
      { text: "HVAC", brand: "Daikin", domain: "daikin.com" },
      { text: "Films", brand: "3M", domain: "3m.com" }
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
    slug:"minimalist-villa-interior-noida",
    title: "Minimalist Villa Interior – Noida",
    shortDescription: "Luxury villa interior with minimalist design and natural light focus.",
    overview: "Designed for modern family living, this villa interior emphasizes clean lines, open spaces, and a calm visual language while ensuring premium materials and long-term durability.",
    location: "Noida, India",
    category: "Residential Villa Interior",
    duration: "Completed in 60 Days",
    status: "Successfully Delivered",
    executionModel: "Custom Design & Build",
    qualityAssurance: "Material & Finish Validation",
    startDate: "01 Feb 2025",
    endDate: "15 Apr 2025",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1600607686527-6fb886090705",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457",
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=800"
    ],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    materials: [
      { text: "Mattresses", brand: "Sleepwell", domain: "sleepwellproducts.com" },
      { text: "Wardrobes", brand: "Hettich", domain: "hettich.com" },
      { text: "Veneers", brand: "Greenply", domain: "greenply.com" },
      { text: "Lighting", brand: "Philips Hue", domain: "philips-hue.com" },
      { text: "Fabrics", brand: "D'Decor", domain: "ddecor.com" },
      { text: "Foam", brand: "Kurlon", domain: "kurlon.com" },
      { text: "ACs", brand: "Panasonic", domain: "panasonic.com" },
      { text: "Locks", brand: "Yale", domain: "yalehome.com" }
    ],
    workforce: [
      { icon: "FiUsers", label: "Total Workforce", value: "15 Professionals" },
      { icon: "FiScissors", label: "Carpenters", value: "6 Specialists" },
      { icon: "FiZap", label: "Electricians", value: "2 Technicians" },
      { icon: "FiEdit3", label: "Painters", value: "4 Finishers" },
      { icon: "FiShield", label: "Site Supervisor", value: "1 Senior Lead" },
    ],
  },
  {
    id: 4,
    slug:"boutique-cafe-interior-gurgaon",
    title: "Boutique Café Interior – Gurgaon",
    shortDescription: "Aesthetic commercial interior blending rustic charm with modern comfort.",
    overview: "We crafted a welcoming and photogenic café environment that enhances the customer experience. The design features warm wood tones, bespoke metal fixtures, and atmospheric lighting optimized for both daytime and evening moods.",
    location: "Gurgaon, India",
    category: "Commercial Interior",
    duration: "Completed in 25 Days",
    status: "Successfully Delivered",
    executionModel: "Fast-Track Commercial Execution",
    qualityAssurance: "Commercial Grade Testing",
    startDate: "10 Mar 2025",
    endDate: "05 Apr 2025",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf",
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0",
    ],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    materials: [
      { text: "Marble", brand: "Classic Marble", domain: "classicmarble.com" },
      { text: "Wallpapers", brand: "Nilaya", domain: "asianpaints.com/nilaya" },
      { text: "Chandeliers", brand: "White Teak", domain: "whiteteak.com" },
      { text: "TVs", brand: "Sony", domain: "sony.com" },
      { text: "Audio", brand: "Bose", domain: "bose.com" },
      { text: "Curtains", brand: "D'Decor", domain: "ddecor.com" },
      { text: "Fans", brand: "Havells", domain: "havells.com" },
      { text: "Appliances", brand: "LG", domain: "lg.com" }
    ],
    workforce: [
      { icon: "FiUsers", label: "Total Workforce", value: "8 Professionals" },
      { icon: "FiScissors", label: "Carpenters", value: "3 Specialists" },
      { icon: "FiZap", label: "Electricians", value: "2 Technicians" },
      { icon: "FiEdit3", label: "Painters", value: "2 Finishers" },
      { icon: "FiShield", label: "Site Supervisor", value: "1 Lead" },
    ],
  }
];
