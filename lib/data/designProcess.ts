import {
  FiMessageCircle,
  FiMapPin,
  FiLayers,
  FiPackage,
  FiTool,
  FiCheckCircle,
} from "react-icons/fi";
import { IconType } from "react-icons";

export type DesignProcessStep = {
  id: number;
  title: string;
  description: string;
  icon: IconType;
};

export const designProcessData: DesignProcessStep[] = [
  {
    id: 1,
    title: "Initial Consultation",
    description:
      "We understand your requirements, lifestyle, budget, and design expectations.",
    icon: FiMessageCircle,
  },
  {
    id: 2,
    title: "Site Visit & Measurements",
    description:
      "Our team visits the site to take accurate measurements and assess the space.",
    icon: FiMapPin,
  },
  {
    id: 3,
    title: "Concept & 3D Design",
    description:
      "We create layouts and 3D designs so you can visualize the final outcome.",
    icon: FiLayers,
  },
  {
    id: 4,
    title: "Material Selection",
    description:
      "Premium materials, finishes, and fittings are finalized with your approval.",
    icon: FiPackage,
  },
  {
    id: 5,
    title: "Execution & Management",
    description:
      "Our experts handle execution with strict quality and timeline control.",
    icon: FiTool,
  },
  {
    id: 6,
    title: "Quality Check & Handover",
    description:
      "Final inspection is done before handing over your completed space.",
    icon: FiCheckCircle,
  },
];
