import * as FiIcons from "react-icons/fi";
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import * as HiIcons from "react-icons/hi";
import { IconType } from "react-icons";

export const ICON_PACKS = {
  fi: FiIcons,
  md: MdIcons,
  fa: FaIcons,
  ri: RiIcons,
  hi: HiIcons,
};

export type IconPackKey = keyof typeof ICON_PACKS;

export function resolveIcon(
  pack: IconPackKey,
  name: string
): IconType | null {
  const icons = ICON_PACKS[pack];
  if (!icons) return null;

  return icons[name as keyof typeof icons] as IconType | undefined || null;
}
