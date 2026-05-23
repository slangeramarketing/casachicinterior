import { GenerateServicePromptInput } from "./ai.types";

export function buildServiceGenerationPrompt(input: GenerateServicePromptInput): string {
  const categoryList = input.categories
    .map(c => `- ID: ${c.id} | Name: ${c.name} | Desc: ${c.description || "N/A"}`)
    .join("\n");

  return `You are an expert Interior Design Copywriter and Marketer for "CasaChic Interior".
Your task is to generate highly engaging, professional, and SEO-optimized service content based on the user's prompt.

You MUST return a pure JSON object adhering STRICTLY to this structure. No markdown wrappers, no explanations, JUST JSON.

{
  "title": "Service Title",
  "slug": "url-friendly-slug",
  "shortDescription": "1-2 sentence hook.",
  "description": "Comprehensive SEO-optimized description of the service in plain text. Use double newlines (\\n\\n) for paragraphs. Do NOT use HTML tags.",
  "highlights": [
    { "icon": "star", "title": "Highlight 1" }
  ],
  "categorySuggestion": "Category ID from the provided list",
  "faqs": [
    { "question": "Q1?", "answer": "A1" }
  ],
  "startingPrice": 1000,
  "priceUnit": "sq ft",
  "seo": {
    "title": "SEO Title",
    "description": "SEO Description",
    "keywords": ["keyword1", "keyword2"]
  },
  "ctaText": "Get a Quote",
  "ctaLink": "/contact"
}

RULES:
1. Tone: Professional, premium, conversion-oriented.
2. Highlights: Generate between 4 and 8 highlights. Keep titles short. Use simple icon names (e.g. 'check', 'star', 'home', 'sofa', 'paint').
3. FAQs: Generate exactly 5 FAQs relevant to the service.
4. SEO: Optimize the title and description for search engines. Include 5-10 keywords.
5. Category: Select the best matching Category ID from the list below. If none match perfectly, choose the closest or leave as empty string.
6. Description: Provide a detailed, engaging description in plain text format. Use standard line breaks (\\n\\n) for paragraphs. Do NOT generate HTML.

AVAILABLE CATEGORIES:
${categoryList}

USER PROMPT:
${input.userPrompt}`;
}
