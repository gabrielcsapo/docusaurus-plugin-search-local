import { sanitizeUrl } from "@braintree/sanitize-url";

const END_SLASH_PATTERN = /\/$/;
const START_SLASH_PATTERN = /^\//;
const PROTOCOL_PATTERN = /^http[s]?:\/\//;

function isBaseOverlapping(baseParts: string[], routeParts: string[]): boolean {
  const base = baseParts.join("");
  const route = routeParts.join("");

  return route.startsWith(base);
}

export function getExternalURI(documentPath: string, baseURI: string): string {
  // Sanitize input
  const sanitizedBase = sanitizeUrl(baseURI);
  const sanitizedRoute = sanitizeUrl(documentPath);

  // Replace slashes where necessary
  const base = sanitizedBase.replace(END_SLASH_PATTERN, "");
  const route = sanitizedRoute.replace(START_SLASH_PATTERN, "");

  const baseParts = base.replace(PROTOCOL_PATTERN, "").split("/");
  const routeParts = route.split("/");

  let externalBase = base;

  for (
    let baseIdx = 0;
    baseIdx < baseParts.length && externalBase === base;
    baseIdx++
  ) {
    const basePart = baseParts[baseIdx];

    // If we find a potential overlapping part
    if (basePart === routeParts[0]) {
      // Check to see if the route starts with the rest of base URI.
      if (isBaseOverlapping(baseParts.slice(baseIdx), routeParts)) {
        // Set the external base to the start of the original base up until the first overlapping part.
        externalBase = baseParts.slice(0, baseIdx).join("/");
      }
    }
  }

  return `${externalBase}/${routeParts.join("/")}`;
}
