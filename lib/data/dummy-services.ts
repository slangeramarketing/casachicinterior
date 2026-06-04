export type DummyService = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  heroImage: string;
  rawMaterials: { name: string; brand: string; domain?: string }[];
  about: { text: string; image: string };
  gallery: string[];
  videos: string[];
  steps: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
};

export const dummyServices: DummyService[] = [
  {
    id: "s1",
    slug: "home-renovation",
    title: "Home Renovation",
    shortDescription: "Complete end-to-end home renovation turning your existing house into a modern luxury living space.",
    heroImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=2000",
    rawMaterials: [
      { name: "Plywood", brand: "CenturyPly", domain: "centuryply.com" },
      { name: "Hardware", brand: "Hettich", domain: "hettich.com" },
      { name: "Paint", brand: "Asian Paints", domain: "asianpaints.com" },
      { name: "Laminates", brand: "Merino", domain: "merinolaminates.com" },
      { name: "Lighting", brand: "Havells", domain: "havells.com" },
      { name: "Bath Fittings", brand: "Jaquar", domain: "jaquar.com" },
      { name: "Tiles", brand: "Kajaria", domain: "kajariaceramics.com" },
      { name: "Switches", brand: "Philips", domain: "philips.com" }
    ],
    about: {
      text: "Our home renovation service completely transforms your outdated spaces into modern, functional, and aesthetically pleasing environments. We handle everything from civil changes and plumbing to bespoke furniture and smart lighting.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000"
    },
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
    ],
    videos: [
      "https://www.w3schools.com/html/mov_bbb.mp4",
      "https://www.w3schools.com/html/mov_bbb.mp4"
    ],
    steps: [
      { title: "Consultation & Site Visit", description: "We understand your vision and assess the current structure." },
      { title: "3D Design & Planning", description: "Visualizing the transformation with high-quality 3D renders." },
      { title: "Execution & Civil Work", description: "Tearing down the old and building the new framework." },
      { title: "Furnishing & Handover", description: "Final touches, deep cleaning, and project delivery." }
    ],
    faqs: [
      { question: "How long does a full home renovation take?", answer: "Typically 60 to 90 days depending on the scope of civil work." },
      { question: "Do I need to vacate my home?", answer: "For full home renovations, we highly recommend vacating to ensure speed and safety." }
    ]
  },
  {
    id: "s2",
    slug: "office-interior",
    title: "Office Interior",
    shortDescription: "Premium workspace design to boost productivity and reflect your brand identity.",
    heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000",
    rawMaterials: [
      { name: "Acoustic Panels", brand: "Armstrong", domain: "armstrongceilings.com" },
      { name: "Chairs", brand: "Herman Miller", domain: "hermanmiller.com" },
      { name: "Glass", brand: "Saint-Gobain", domain: "saint-gobain.com" },
      { name: "Flooring", brand: "Interface", domain: "interface.com" },
      { name: "Furniture", brand: "Godrej", domain: "godrejinterio.com" },
      { name: "Lighting", brand: "Wipro", domain: "wiprolighting.com" },
      { name: "HVAC", brand: "Daikin", domain: "daikin.com" },
      { name: "Films", brand: "3M", domain: "3m.com" }
    ],
    about: {
      text: "We design offices that inspire. From ergonomic workstations to impressive reception areas and collaborative breakout zones, our office interiors balance aesthetics with ultimate functionality.",
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1000"
    },
    gallery: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800"
    ],
    videos: [
      "https://www.w3schools.com/html/mov_bbb.mp4"
    ],
    steps: [
      { title: "Requirements Gathering", description: "Understanding team size, hierarchy, and brand guidelines." },
      { title: "Space Planning", description: "Optimizing floor plans for maximum efficiency." },
      { title: "Fit-outs & Wiring", description: "Setting up networking, HVAC, and modular structures." },
      { title: "Move-in Ready", description: "Delivering a fully functional plug-and-play office." }
    ],
    faqs: [
      { question: "Do you handle IT networking?", answer: "Yes, our MEP team handles end-to-end networking and HVAC setups." },
      { question: "Can you do weekend-only work?", answer: "Yes, we offer phased execution for operational offices." }
    ]
  },
  {
    id: "s3",
    slug: "kitchen-interior",
    title: "Kitchen Interior",
    shortDescription: "Sleek, highly functional modular kitchens tailored to your cooking style.",
    heroImage: "https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&q=80&w=2000",
    rawMaterials: [
      { name: "Hinges", brand: "Blum", domain: "blum.com" },
      { name: "Countertops", brand: "Kalinga", domain: "kalingastone.com" },
      { name: "Appliances", brand: "Bosch", domain: "bosch-home.com" },
      { name: "Hardware", brand: "Hafele", domain: "hafele.com" },
      { name: "Shutters", brand: "Rehau", domain: "rehau.com" },
      { name: "Chimneys", brand: "Faber", domain: "faberspa.com" },
      { name: "Sliders", brand: "Hettich", domain: "hettich.com" },
      { name: "Sinks", brand: "Franke", domain: "franke.com" }
    ],
    about: {
      text: "The kitchen is the heart of the home. We build customized modular kitchens maximizing storage, utilizing the working triangle, and ensuring premium durability against moisture and heat.",
      image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&q=80&w=1000"
    },
    gallery: [
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&q=80&w=800"
    ],
    videos: [
      "https://www.w3schools.com/html/mov_bbb.mp4"
    ],
    steps: [
      { title: "Appliance Selection", description: "Finalizing built-in appliances to plan exact cutouts." },
      { title: "Ergonomic Design", description: "Planning the golden triangle (Sink, Stove, Fridge)." },
      { title: "Factory Production", description: "Precision cutting and edge-banding in our factory." },
      { title: "Quick Installation", description: "Installing the modular units in just a few days." }
    ],
    faqs: [
      { question: "Are the kitchens water-proof?", answer: "Yes, we use BWP (Boiling Water Proof) plywood for all base cabinets." },
      { question: "What is the warranty?", answer: "We provide a 10-year warranty on modular woodwork and lifetime warranty on Blum hardware." }
    ]
  },
  {
    id: "s4",
    slug: "bedroom-interior",
    title: "Bedroom Interior",
    shortDescription: "Personalized sanctuaries designed for ultimate comfort and relaxation.",
    heroImage: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=2000",
    rawMaterials: [
      { name: "Mattresses", brand: "Sleepwell", domain: "sleepwellproducts.com" },
      { name: "Wardrobes", brand: "Hettich", domain: "hettich.com" },
      { name: "Veneers", brand: "Greenply", domain: "greenply.com" },
      { name: "Lighting", brand: "Philips Hue", domain: "philips-hue.com" },
      { name: "Fabrics", brand: "D'Decor", domain: "ddecor.com" },
      { name: "Foam", brand: "Kurlon", domain: "kurlon.com" },
      { name: "ACs", brand: "Panasonic", domain: "panasonic.com" },
      { name: "Locks", brand: "Yale", domain: "yalehome.com" }
    ],
    about: {
      text: "Your bedroom should be a retreat. We design cozy, luxurious bedrooms with smart storage wardrobes, ambient lighting, and acoustic comfort to ensure you get the best rest.",
      image: "https://images.unsplash.com/photo-1522771731478-44fb896cb121?auto=format&fit=crop&q=80&w=1000"
    },
    gallery: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800"
    ],
    videos: [
      "https://www.w3schools.com/html/mov_bbb.mp4"
    ],
    steps: [
      { title: "Layout Planning", description: "Optimizing bed placement, wardrobes, and walk-in closets." },
      { title: "Material Selection", description: "Choosing soft fabrics, veneers, and relaxing color palettes." },
      { title: "Lighting Design", description: "Integrating reading lights, cove lights, and dimmers." },
      { title: "Final Styling", description: "Adding rugs, curtains, and artwork for a complete look." }
    ],
    faqs: [
      { question: "Do you design custom walk-in closets?", answer: "Absolutely. We specialize in custom wardrobe and walk-in closet solutions." },
      { question: "Can you soundproof the bedroom?", answer: "Yes, we can use acoustic panels and double-glazed windows to reduce external noise." }
    ]
  },
  {
    id: "s5",
    slug: "living-room-interior",
    title: "Living Room Interior",
    shortDescription: "Elegant and welcoming living spaces that make a lasting impression.",
    heroImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000",
    rawMaterials: [
      { name: "Marble", brand: "Classic Marble", domain: "classicmarble.com" },
      { name: "Wallpapers", brand: "Nilaya", domain: "asianpaints.com/nilaya" },
      { name: "Chandeliers", brand: "White Teak", domain: "whiteteak.com" },
      { name: "TVs", brand: "Sony", domain: "sony.com" },
      { name: "Audio", brand: "Bose", domain: "bose.com" },
      { name: "Curtains", brand: "D'Decor", domain: "ddecor.com" },
      { name: "Fans", brand: "Havells", domain: "havells.com" },
      { name: "Appliances", brand: "LG", domain: "lg.com" }
    ],
    about: {
      text: "The living room is where memories are made. We create stunning living spaces with luxurious seating, striking TV units, and statement lighting that perfectly balance family comfort with guest entertainment.",
      image: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&q=80&w=1000"
    },
    gallery: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1583847268964-b28e50bc09e0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600607687644-aac4c15cecb1?auto=format&fit=crop&q=80&w=800"
    ],
    videos: [
      "https://www.w3schools.com/html/mov_bbb.mp4"
    ],
    steps: [
      { title: "Focal Point Design", description: "Designing the TV unit or fireplace as the main attraction." },
      { title: "Seating Layout", description: "Arranging furniture to encourage conversation and flow." },
      { title: "Ceiling & Lighting", description: "Executing false ceilings and statement chandeliers." },
      { title: "Decor Integration", description: "Placing artifacts, plants, and rugs to tie the room together." }
    ],
    faqs: [
      { question: "Do you provide loose furniture like sofas?", answer: "Yes, we custom manufacture high-end sofas to perfectly match the room's dimensions and style." },
      { question: "Can we integrate a smart home system?", answer: "Yes, we integrate lighting, curtains, and AV systems with smart home controllers." }
    ]
  }
];
