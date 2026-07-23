import { describe, expect, it } from "vitest";
import { sanitizeCmsHtml } from "./sanitizeCmsHtml";

describe("sanitizeCmsHtml", () => {
  it("removes scripts, event handlers, and unsafe URLs", () => {
    const unsafeHtml = [
      '<p onclick="steal()">Welcome</p>',
      "<script>steal()</script>",
      '<a href="javascript:steal()">Open</a>',
    ].join("");

    const sanitized = sanitizeCmsHtml(unsafeHtml);

    expect(sanitized).toContain("<p>Welcome</p>");
    expect(sanitized).not.toContain("script");
    expect(sanitized).not.toContain("onclick");
    expect(sanitized).not.toContain("javascript:");
  });

  it("keeps ordinary CMS formatting and safe links", () => {
    const safeHtml =
      '<p><strong>Offer</strong> <a href="https://example.ch">details</a></p>';

    expect(sanitizeCmsHtml(safeHtml)).toBe(safeHtml);
  });
});
