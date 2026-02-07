// constants/interior-icons.ts
import { 
  FiHome, FiBox, FiLayers, FiLayout, FiEdit3, 
  FiShield, FiTruck,
  FiDollarSign, FiAward, FiHeart, FiSettings, FiBriefcase,
  FiZap, FiDroplet, FiSun, FiMaximize, FiScissors,
  FiEdit, FiGrid, FiTarget, FiPenTool,
  FiImage, FiWind, FiMinimize2, FiArchive, FiFeather,
  FiActivity, FiVolume2, FiSearch, FiUserCheck, FiAnchor,
  FiMinimize,
  FiStar,
  FiAperture,
  FiArrowDownCircle,
  FiCircle,
  FiCloudRain,
  FiAirplay,
  FiTv,
  FiKey
} from "react-icons/fi"; 
import { RiFileAddFill } from "react-icons/ri";
import { IconType } from "react-icons";

export interface InteriorIconItem {
  id: string;
  label: string;
  icon: IconType;
}

export const INTERIOR_ICONS: InteriorIconItem[] = [
  // 📐 Design & Planning
  { id: "consultation", label: "Consultation", icon: FiEdit3 },
  { id: "3d-plan", label: "3D Visualization", icon: FiBox },
  { id: "layout", label: "Layout Planning", icon: FiLayout },
  { id: "measurement", label: "Site Measurement", icon: FiEdit },
  { id: "design", label: "Design Concept", icon: FiPenTool },
  
  // 🏠 Spaces & Rooms
  { id: "modular-kitchen", label: "Modular Kitchen", icon: FiGrid },
  { id: "living-room", label: "Living Room", icon: FiHome },
  { id: "bedroom", label: "Bedroom", icon: FiLayers },
  { id: "flooring", label: "Flooring", icon: FiMaximize },
  
  // 🛠️ Core Services & Technical
  { id: "execution", label: "Execution", icon: FiSettings },
  { id: "electrical", label: "Electrical Work", icon: FiZap },
  { id: "plumbing", label: "Plumbing", icon: FiDroplet },
  { id: "lighting", label: "Lighting", icon: FiSun },
  { id: "civil-work", label: "Civil Work", icon: FiBriefcase },
  
  // 🛡️ Quality & Trust
  { id: "quality", label: "Quality Check", icon: FiShield },
  { id: "delivery", label: "On-time Delivery", icon: FiTruck },
  { id: "budget", label: "Budget Friendly", icon: FiDollarSign },
  { id: "guarantee", label: "Warranty", icon: FiAward },
  { id: "support", label: "Customer Support", icon: FiHeart },
  { id: "durability", label: "Long-Lasting Build", icon: FiAnchor },

  // ✨ Finishing & Textures
  { id: "wallpaper", label: "Premium Wallpaper", icon: FiImage },
  { id: "veneer", label: "Natural Veneer", icon: FiWind },
  { id: "pu-paint", label: "High-Gloss PU Paint", icon: FiDroplet },
  { id: "fabric-upholstery", label: "Premium Upholstery", icon: FiFeather },
  
  // 📦 Space Optimization
  { id: "space-saving", label: "Space Saving", icon: FiMinimize2 },
  { id: "storage", label: "Smart Storage", icon: FiArchive },

  // 🛋️ Lifestyle & Comfort
  { id: "ergonomic", label: "Ergonomic Design", icon: FiActivity },
  { id: "smart-home", label: "Smart Home Integration", icon: FiZap },
  { id: "acoustic", label: "Acoustic Treatment", icon: FiVolume2 },

  // 🏗️ Advanced Standards
  { id: "anti-termite", label: "Anti-Termite Treatment", icon: FiShield },
  { id: "fire-rated", label: "Fire-Rated Materials", icon: FiTarget },
  { id: "precision", label: "Laser-Level Precision", icon: FiScissors },
  { id: "eco-friendly", label: "Eco-Friendly Materials", icon: RiFileAddFill },

  // 🤝 Business Transparency
  { id: "transparent-pricing", label: "No Hidden Costs", icon: FiSearch },
  { id: "expert-supervision", label: "Expert Supervision", icon: FiUserCheck },
  { id: "fast-track", label: "Fast-Track Execution", icon: FiZap },

  // 🎭 Style & Aesthetics
  { id: "minimalist", label: "Minimalist Design", icon: FiMinimize },
  { id: "luxury", label: "Luxury Interiors", icon: FiStar },
  { id: "color-harmony", label: "Color Harmony", icon: FiAperture },

  // 🔧 Utility & Fittings
  { id: "soft-close", label: "Soft-Close Hardware", icon: FiArrowDownCircle },
  { id: "custom-hardware", label: "Custom Handles & Knobs", icon: FiCircle },
  { id: "water-resistant", label: "Water-Resistant Areas", icon: FiCloudRain },
  { id: "ventilation", label: "Advanced Ventilation", icon: FiAirplay },

  // ✅ Workflow & Handover
  { id: "live-updates", label: "Live Project Updates", icon: FiTv },
  { id: "key-handover", label: "Final Key Handover", icon: FiKey },
];

export function getInteriorIconById(id: string): IconType {
  const item = INTERIOR_ICONS.find((icon) => icon.id === id);
  return item ? item.icon : FiHome; 
}