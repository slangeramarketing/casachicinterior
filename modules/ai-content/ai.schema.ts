import { z } from "zod";

export const GeneratedServiceSchema = z.object({
  title: z.string(),
  slug: z.string(),
  shortDescription: z.string(),
  description: z.string(), // We'll return HTML string or rich text string
  
  highlights: z.array(
    z.object({
      icon: z.string(),
      title: z.string(),
    })
  ).min(4).max(8),
  
  categorySuggestion: z.string().optional(),
  
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ).min(3),
  
  startingPrice: z.number().nullable(),
  priceUnit: z.string(),
  
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
  }),
  
  ctaText: z.string(),
  ctaLink: z.string(),
});

export type GeneratedServiceData = z.infer<typeof GeneratedServiceSchema>;
