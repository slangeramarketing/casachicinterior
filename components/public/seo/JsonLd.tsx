/***************************************************
 * File: components/public/seo/JsonLd.tsx
 * Purpose:
 * - Render one or more schema.org blocks as application/ld+json.
 * - Safe to use from Server Components; no client JS.
 ***************************************************/

import { JsonLdObject, serializeJsonLd } from "@/lib/seo/jsonLd";

export default function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
