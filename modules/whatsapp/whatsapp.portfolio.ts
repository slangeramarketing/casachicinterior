export const whatsappPortfolio = {
  getLink(requirement: string): string | null {
    if (!requirement) return null;

    const req = requirement.toLowerCase();

    if (req.includes("kitchen")) {
      return "https://www.casachicinterior.in/services/detail/modular-kitchen-design";
    }

    if (req.includes("wardrobe")) {
      return "https://www.casachicinterior.in/services/detail/modern-modular-wardrobe-designs-for-bedroom";
    }

    if (req.includes("bedroom")) {
      return "https://www.casachicinterior.in/services/detail/modular-living-room-furniture-design-ideas";
    }

    if (req.includes("commercial") || req.includes("office")) {
      return "https://www.casachicinterior.in/services/detail/strategic-corporate-office-design-workspace-optimization";
    }

    if (req.includes("renovation")) {
      return "https://www.casachicinterior.in/services/detail/home-renovation-interior-style-makeover";
    }

    return null;
  }
};
