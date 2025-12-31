/* -------------------------------------
   TYPES (Schema Aligned)
------------------------------------- */
export type BlogStatus = "draft" | "published";

export interface BlogData {
  id:string;
  title: string;
  slug: string;

  description: string;
  richText: string;
  thumbnailImage: string;

  category: string;
  subCategory: string;

  status: BlogStatus;
  featured: boolean;

  author: string; // ObjectId string

  seo: {
    metaTitle?: string;
    metaDescription?: string;
  };

  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/* -------------------------------------
   BLOG DATA ARRAY
------------------------------------- */
export const blogsData: BlogData[] = [
  {
    id:"1",
    title: "Modern Home Interior Design Trends for 2025",
    slug: "modern-home-interior-design-trends-2025",

    description:
      "Discover the top modern home interior design trends for 2025, including colors, materials, smart homes, and modular interiors.",

    thumbnailImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",

    richText: `
      <p>
        Modern interior design in 2025 focuses on comfort, functionality,
        and personalization. Homes are no longer just visually appealing
        spaces — they are designed to improve daily living.
      </p>

      <img
        src="https://images.unsplash.com/photo-1600573472592-401b489a3cdc"
        alt="Modern living room interior"
        style="width:100%; border-radius:12px; margin:24px 0;"
      />

      <h2>1. Warm & Natural Color Palettes</h2>
      <p>
        Soft neutrals like beige, sand, and warm greys are replacing
        bright whites. These colors create a calm and welcoming
        environment while pairing perfectly with wooden textures.
      </p>

      <img
        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
        alt="Warm color interior design"
        style="width:100%; border-radius:12px; margin:24px 0;"
      />

      <h2>2. Modular & Space-Saving Interiors</h2>
      <p>
        Modular kitchens, wardrobes, and multifunctional furniture
        dominate modern homes. These designs help maximize space
        without compromising aesthetics.
      </p>

      <img
        src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b"
        alt="Modular interior furniture"
        style="width:100%; border-radius:12px; margin:24px 0;"
      />

      <h2>3. Smart Home Integration</h2>
      <p>
        Smart lighting, automated curtains, and voice-controlled
        appliances are becoming standard. These features improve
        convenience and energy efficiency.
      </p>

      <img
        src="https://images.unsplash.com/photo-1558002038-1055907df827"
        alt="Smart home interior"
        style="width:100%; border-radius:12px; margin:24px 0;"
      />

      <h2>Conclusion</h2>
      <p>
        Interior design trends in 2025 emphasize balance — beauty with
        functionality, luxury with sustainability, and trends with
        personalization. A well-designed home should reflect the
        lifestyle of the people living in it.
      </p>
    `,

    category: "Interior Design",
    subCategory: "Home Interior",

    status: "published",
    featured: true,

    author: "64f1b2c9e2a4a9b8f1c12345",

    seo: {
      metaTitle: "Modern Home Interior Design Trends 2025",
      metaDescription:
        "Explore modern home interior design trends for 2025 including warm colors, modular furniture, and smart home solutions.",
    },

    publishedAt: new Date("2025-01-10"),
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-12"),
  },{
  id: "2",
  title: "Living Room Interior Design Ideas for Modern Homes",
  slug: "living-room-interior-design-ideas",

  description:
    "Discover modern living room interior design ideas that balance comfort, aesthetics, and functionality.",

  thumbnailImage:
    "https://images.unsplash.com/photo-1600573472592-401b489a3cdc",

  richText: `
    <p>
      The living room is the heart of a home. It reflects your lifestyle,
      personality, and comfort preferences. A well-designed living room
      should feel welcoming while remaining functional.
    </p>

    <img
      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
      alt="Modern living room interior"
      style="width:100%; border-radius:12px; margin:24px 0;"
    />

    <h2>Layout & Space Planning</h2>
    <p>
      Furniture placement plays a crucial role in defining the flow of
      movement. Open layouts with flexible seating arrangements create
      an airy and spacious feel.
    </p>

    <h2>Lighting & Ambience</h2>
    <p>
      Layered lighting using ceiling lights, floor lamps, and accent
      lighting enhances the mood and functionality of the space.
    </p>

    <img
      src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
      alt="Living room lighting design"
      style="width:100%; border-radius:12px; margin:24px 0;"
    />

    <p>
      A modern living room combines style with comfort, creating a space
      where families can relax and guests feel welcome.
    </p>
  `,

  category: "Interior Design",
  subCategory: "Living Room",

  status: "published",
  featured: true,

  author: "64f1b2c9e2a4a9b8f1c12345",

  seo: {
    metaTitle: "Living Room Interior Design Ideas",
    metaDescription:
      "Explore modern living room interior design ideas with smart layouts, lighting, and décor tips.",
  },

  publishedAt: new Date("2025-01-15"),
  createdAt: new Date("2025-01-10"),
  updatedAt: new Date("2025-01-12"),
},
{
  id: "3",
  title: "Bedroom Interior Design Tips for Comfort & Style",
  slug: "bedroom-interior-design-tips",

  description:
    "Learn how to design a bedroom that promotes relaxation, comfort, and modern aesthetics.",

  thumbnailImage:
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",

  richText: `
    <p>
      A bedroom should be a peaceful retreat where comfort meets
      personal style. Modern bedroom interiors focus on calm colors,
      soft textures, and clutter-free layouts.
    </p>

    <img
      src="https://images.unsplash.com/photo-1615874959474-d609969a20ed"
      alt="Modern bedroom interior"
      style="width:100%; border-radius:12px; margin:24px 0;"
    />

    <h2>Color Palette</h2>
    <p>
      Neutral tones, pastel shades, and warm colors create a soothing
      environment that helps in relaxation and better sleep.
    </p>

    <h2>Furniture & Storage</h2>
    <p>
      Beds with built-in storage, minimal wardrobes, and side tables
      keep the bedroom organized without compromising aesthetics.
    </p>

    <img
      src="https://images.unsplash.com/photo-1600607688061-1c7c60cdbb6a"
      alt="Bedroom storage design"
      style="width:100%; border-radius:12px; margin:24px 0;"
    />

    <p>
      A thoughtfully designed bedroom enhances comfort, improves sleep
      quality, and reflects your personal taste.
    </p>
  `,

  category: "Interior Design",
  subCategory: "Bedroom",

  status: "published",
  featured: false,

  author: "64f1b2c9e2a4a9b8f1c12345",

  seo: {
    metaTitle: "Bedroom Interior Design Tips",
    metaDescription:
      "Design a modern bedroom with calming colors, smart storage, and comfortable layouts.",
  },

  publishedAt: new Date("2025-01-18"),
  createdAt: new Date("2025-01-10"),
  updatedAt: new Date("2025-01-12"),
},
{
  id: "4",
  title: "Modern Kitchen Interior Design for Smart Living",
  slug: "modern-kitchen-interior-design",

  description:
    "Explore modern kitchen interior design ideas that combine efficiency, style, and smart storage solutions.",

  thumbnailImage:
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b",

  richText: `
    <p>
      Modern kitchens are designed for efficiency, hygiene, and
      aesthetics. A well-planned kitchen improves workflow and
      enhances everyday cooking experiences.
    </p>

    <img
      src="https://images.unsplash.com/photo-1600585154526-990dced4db0d"
      alt="Modern modular kitchen"
      style="width:100%; border-radius:12px; margin:24px 0;"
    />

    <h2>Modular Layouts</h2>
    <p>
      Modular kitchens offer smart storage solutions, easy maintenance,
      and customizable layouts that suit different home sizes.
    </p>

    <h2>Materials & Finishes</h2>
    <p>
      High-quality materials like quartz countertops, moisture-resistant
      cabinets, and matte finishes ensure durability and elegance.
    </p>

    <img
      src="https://images.unsplash.com/photo-1600607687644-aac4c3eac7f1"
      alt="Kitchen materials and finishes"
      style="width:100%; border-radius:12px; margin:24px 0;"
    />

    <p>
      A modern kitchen blends functionality with design, making it a
      practical yet visually appealing space.
    </p>
  `,

  category: "Interior Design",
  subCategory: "Kitchen",

  status: "published",
  featured: false,

  author: "64f1b2c9e2a4a9b8f1c12345",

  seo: {
    metaTitle: "Modern Kitchen Interior Design",
    metaDescription:
      "Discover modern kitchen interior design ideas with modular layouts, smart storage, and premium finishes.",
  },

  publishedAt: new Date("2025-01-20"),
  createdAt: new Date("2025-01-10"),
  updatedAt: new Date("2025-01-12"),
}

];
