import {
  FiClock,
  FiBox,
  FiUsers,
  FiSettings,
  FiShield,
  FiHeadphones,
  FiDollarSign,
  FiLayers,
} from "react-icons/fi";

import { IconType } from "react-icons";

export type WhyChooseItem = {
  id: number;
  title: string;
  icon: IconType;   // ✅ store component, NOT JSX
  position?: keyof typeof positionClasses;
};

export const positionClasses = {
  "top-left": "top-10 left-10",
  top: "top-0 left-1/2 -translate-x-1/2",
  "top-right": "top-10 right-10",
  right: "top-1/2 right-0 -translate-y-1/2",
  "bottom-right": "bottom-10 right-10",
  bottom: "bottom-0 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-10 left-10",
  left: "top-1/2 left-0 -translate-y-1/2",
};

export const whyChooseUsData: WhyChooseItem[] = [
  { id: 1, title: "On-Time Project Delivery", icon: FiClock, position: "top-left" },
  { id: 2, title: "100+ Successfully Delivered Projects", icon: FiBox, position: "top" },
  { id: 3, title: "End-to-End Interior Services", icon: FiUsers, position: "top-right" },
  { id: 4, title: "Customized Design Solutions", icon: FiSettings, position: "right" },
  { id: 5, title: "Premium Materials & Workmanship", icon: FiShield, position: "bottom-right" },
  { id: 6, title: "Transparent & Fair Pricing", icon: FiDollarSign, position: "bottom" },
  { id: 7, title: "Dedicated Support Throughout the Project", icon: FiHeadphones, position: "bottom-left" },
  { id: 8, title: "3D Visualization Before Execution", icon: FiLayers, position: "left" },
];
