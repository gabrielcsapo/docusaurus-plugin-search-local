import { sanitizeUrl } from "@braintree/sanitize-url";
import type { SearchDocument } from "../../types";

const END_SLASH_PATTERN = /\/$/;
const START_SLASH_PATTERN = /^\//;
const PROTOCOL_PATTERN = /^http[s]?:\/\//;

function stripDuplicateRouteParts(
  basePart: string,
  routeParts: string[]
): string[] {
  if (routeParts.length === 0) {
    return [];
  }

  if (basePart === routeParts[0]) {
    return routeParts.slice(1);
  }

  return routeParts;
}

export function getExternalURI(doc: SearchDocument, baseURI: string): string {
  // Sanitize input
  const sanitizedBase = sanitizeUrl(baseURI);
  const sanitizedRoute = sanitizeUrl(doc.u);

  // Replace slashes where necessary
  const base = sanitizedBase.replace(END_SLASH_PATTERN, "");
  const route = sanitizedRoute.replace(START_SLASH_PATTERN, "");

  const baseParts = base.replace(PROTOCOL_PATTERN, "").split("/");
  let routeParts = route.split("/");

  baseParts.reverse().forEach((basePart) => {
    routeParts = stripDuplicateRouteParts(basePart, routeParts);
  });

  return `${base}/${routeParts.join("/")}`;
}
