const blockedElements = new Set([
  "SCRIPT",
  "STYLE",
  "IFRAME",
  "OBJECT",
  "EMBED",
  "FORM",
  "INPUT",
  "BUTTON",
]);

function isSafeUrl(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return (
    normalized.startsWith("https://") ||
    normalized.startsWith("http://") ||
    normalized.startsWith("/") ||
    normalized.startsWith("#") ||
    normalized.startsWith("mailto:")
  );
}

export function sanitizeCmsHtml(html: string): string {
  const document = new DOMParser().parseFromString(html, "text/html");

  document.body.querySelectorAll("*").forEach((element) => {
    if (blockedElements.has(element.tagName)) {
      element.remove();
      return;
    }

    for (const attribute of Array.from(element.attributes)) {
      const attributeName = attribute.name.toLowerCase();

      if (
        attributeName.startsWith("on") ||
        attributeName === "style" ||
        attributeName === "srcdoc"
      ) {
        element.removeAttribute(attribute.name);
      }

      if (
        (attributeName === "href" || attributeName === "src") &&
        !isSafeUrl(attribute.value)
      ) {
        element.removeAttribute(attribute.name);
      }
    }

    if (
      element instanceof HTMLAnchorElement &&
      element.target === "_blank"
    ) {
      element.rel = "noopener noreferrer";
    }
  });

  return document.body.innerHTML;
}
