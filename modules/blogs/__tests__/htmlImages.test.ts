/***************************************************
 * File: modules/blogs/__tests__/htmlImages.test.ts
 * Purpose: lib/utils/htmlImages.ts adds alt text and lazy-loading hints
 * to rich-text images that lack them (blog bodies from the editor).
 ***************************************************/

import { describe, it, expect } from "vitest";
import { withImageDefaults } from "@/lib/utils/htmlImages";

describe("withImageDefaults", () => {
  it("adds a fallback alt, lazy loading and async decoding to images without them", () => {
    const out = withImageDefaults('<p>x</p><img src="/a.jpg">', "Kitchen ideas");
    expect(out).toBe('<p>x</p><img src="/a.jpg" alt="Kitchen ideas" loading="lazy" decoding="async">');
  });

  it("leaves existing attributes alone", () => {
    const html = '<img src="/b.jpg" alt="B" loading="eager" decoding="sync"/>';
    expect(withImageDefaults(html, "fallback")).toBe('<img src="/b.jpg" alt="B" loading="eager" decoding="sync">');
  });

  it("escapes the fallback text so it cannot break out of the attribute", () => {
    const out = withImageDefaults('<img src="/c.jpg">', 'Tips <b> & "quotes"');
    expect(out).toContain('alt="Tips &lt;b&gt; &amp; &quot;quotes&quot;"');
  });

  it("handles empty input and multiple images", () => {
    expect(withImageDefaults("", "t")).toBe("");
    const out = withImageDefaults('<img src="/1.jpg"><img src="/2.jpg" alt="">', "t");
    expect(out.match(/alt=/g)).toHaveLength(2);
    expect(out).toContain('<img src="/2.jpg" alt="" loading="lazy" decoding="async">');
  });
});

describe("withImageDefaults edge cases", () => {
  it("does not corrupt an image whose attribute value contains > or a self-closing slash", () => {
    const html = '<img src="/x.jpg" title="A > B" data-note=\'c>d\'/>';
    expect(withImageDefaults(html, "t")).toBe(
      '<img src="/x.jpg" title="A > B" data-note=\'c>d\' alt="t" loading="lazy" decoding="async">'
    );
  });

  it("handles uppercase tags and images without attributes (tag is normalised to lowercase)", () => {
    expect(withImageDefaults("<IMG>", "t")).toBe('<img alt="t" loading="lazy" decoding="async">');
  });
});
