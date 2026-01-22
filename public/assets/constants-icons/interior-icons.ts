// constants/interior-icons.ts
import { 
  FiHome, FiBox, FiLayers, FiLayout, FiEdit3, 
  FiMap, FiCheckCircle, FiShield, FiTruck, FiClock, 
  FiDollarSign, FiAward, FiHeart, FiSettings, FiBriefcase,
  FiZap, FiDroplet, FiSun, FiMaximize, FiScissors,
  FiEdit, FiGrid, FiTarget, FiPenTool
} from "react-icons/fi"; 
import { IconType } from "react-icons";

export interface InteriorIconItem {
  id: string;
  label: string;
  icon: IconType;
}

export const INTERIOR_ICONS: InteriorIconItem[] = [
  // Design & Planning
  { id: "consultation", label: "Consultation", icon: FiEdit3 },
  { id: "3d-plan", label: "3D Visualization", icon: FiBox },
  { id: "layout", label: "Layout Planning", icon: FiLayout },
  { id: "measurement", label: "Site Measurement", icon: FiEdit },
  { id: "design", label: "Design Concept", icon: FiPenTool },
  
  // Spaces
  { id: "modular-kitchen", label: "Modular Kitchen", icon: FiGrid },
  { id: "living-room", label: "Living Room", icon: FiHome },
  { id: "bedroom", label: "Bedroom", icon: FiLayers },
  { id: "flooring", label: "Flooring", icon: FiMaximize },
  
  // Technical
  { id: "execution", label: "Execution", icon: FiSettings },
  { id: "electrical", label: "Electrical Work", icon: FiZap },
  { id: "plumbing", label: "Plumbing", icon: FiDroplet },
  { id: "lighting", label: "Lighting", icon: FiSun },
  { id: "civil-work", label: "Civil Work", icon: FiBriefcase },
  
  // Trust & Value
  { id: "quality", label: "Quality Check", icon: FiShield },
  { id: "delivery", label: "On-time Delivery", icon: FiTruck },
  { id: "budget", label: "Budget Friendly", icon: FiDollarSign },
  { id: "guarantee", label: "Warranty", icon: FiAward },
  { id: "support", label: "Customer Support", icon: FiHeart },
];

export function getInteriorIconById(id: string): IconType {
  const item = INTERIOR_ICONS.find((icon) => icon.id === id);
  // FiHome default fallback hai, yeh kabhi error nahi dega
  return item ? item.icon : FiHome; 
}