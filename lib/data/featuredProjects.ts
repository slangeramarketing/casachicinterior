export type FeaturedProject = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

export const featuredProjects: FeaturedProject[] = [
  {
    id: 1,
    title: "Luxury Living Area",
    subtitle: "Makeover",
    description:
      "Designed around modern lifestyle, this space balances open layouts with rich materials for a statement look.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  },
  {
    id: 2,
    title: "Minimalist Home",
    subtitle: "Office",
    description:
      "Clean lines, natural tones, and optimized storage create a workspace that boosts focus and clarity.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c",
  },
  {
    id: 3,
    title: "Sophisticated",
    subtitle: "Bedroom Interior",
    description:
      "A refined palette and custom-crafted furniture bring warmth and calm into a luxurious private retreat.",
    image:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
  },
];
