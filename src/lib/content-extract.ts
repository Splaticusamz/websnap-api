import type { CheerioAPI } from "cheerio";
import { config } from "./config";

const NOISE_SELECTORS = [
  "script", "style", "noscript", "iframe", "svg",
  "nav", "header", "footer", "aside",
  ".sidebar", ".ad", ".ads", ".advertisement", ".cookie-banner", ".cookie-consent",
  ".popup", ".modal", ".nav", ".menu", ".breadcrumb",
  "[role='navigation']", "[role='banner']", "[role='contentinfo']",
  ".social-share", ".share-buttons", ".comments", "#comments",
];

const CONTENT_SELECTORS = [
  "article", "main", "[role='main']",
  ".post-content", ".article-content", ".entry-content",
  ".content", "#content", ".post-body", ".article-body",
  ".page-content", ".blog-post",
];

export function extractMainContent($: CheerioAPI): string {
  // Clone to avoid mutating
  const $clone = $.root().clone();

  // Remove noise
  for (const sel of NOISE_SELECTORS) {
    $clone.find(sel).remove();
  }

  // Try content selectors in order
  for (const sel of CONTENT_SELECTORS) {
    const el = $clone.find(sel).first();
    if (el.length) {
      const text = cleanText(el.text());
      if (text.length > 100) {
        return text.slice(0, config.maxContentLength);
      }
    }
  }

  // Fallback: body text
  const bodyText = cleanText($clone.find("body").text());
  return bodyText.slice(0, config.maxContentLength);
}

function cleanText(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
