const PLACEHOLDER_IMAGE = "/placeholder.svg";

export function getSafeImageSrc(src: unknown) {
  if (typeof src !== "string") return PLACEHOLDER_IMAGE;

  const value = src.trim();
  if (!value) return PLACEHOLDER_IMAGE;
  if (value.startsWith("/")) return value;

  try {
    const url = new URL(value);
    if (url.protocol === "https:") {
      return value;
    }
  } catch {
    return PLACEHOLDER_IMAGE;
  }

  return PLACEHOLDER_IMAGE;
}

export function getSafeHref(href: unknown) {
  if (typeof href !== "string") return null;

  const value = href.trim();
  if (!value) return null;
  if (value.startsWith("/")) return value;

  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return value;
    }
  } catch {
    return null;
  }

  return null;
}
