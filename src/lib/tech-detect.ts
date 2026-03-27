import type { CheerioAPI } from "cheerio";

export interface TechDetection {
  name: string;
  confidence: "high" | "medium" | "low";
  evidence: string;
}

interface Rule {
  name: string;
  test: (ctx: DetectContext) => string | null;
  confidence: "high" | "medium" | "low";
}

interface DetectContext {
  $: CheerioAPI;
  html: string;
  headers: Record<string, string>;
}

const rules: Rule[] = [
  // Frameworks
  { name: "Next.js", confidence: "high", test: ({ $, html }) => $('script[src*="_next"]').length ? "script src contains _next" : html.includes("__NEXT_DATA__") ? "__NEXT_DATA__ found" : null },
  { name: "Nuxt.js", confidence: "high", test: ({ $, html }) => $('script[src*="_nuxt"]').length ? "_nuxt script" : html.includes("__NUXT__") ? "__NUXT__ global" : null },
  { name: "React", confidence: "medium", test: ({ $, html }) => $("[data-reactroot]").length ? "data-reactroot" : html.includes("react") && html.includes("_reactRoot") ? "React markers" : null },
  { name: "Vue.js", confidence: "medium", test: ({ $, html }) => $("[data-v-]").length || $("[data-vue-ssr-id]").length ? "Vue data attributes" : html.includes("vue") && $('script[src*="vue"]').length ? "Vue script" : null },
  { name: "Angular", confidence: "medium", test: ({ $ }) => $("[ng-version]").length ? `ng-version ${$("[ng-version]").attr("ng-version")}` : $("[_ngcontent]").length || $("[_nghost]").length ? "Angular attributes" : null },
  { name: "Svelte", confidence: "medium", test: ({ $ }) => $("[class*='svelte-']").length ? "Svelte class hash" : null },
  { name: "Gatsby", confidence: "high", test: ({ $ }) => $('script[src*="gatsby"]').length ? "Gatsby script" : $("#___gatsby").length ? "Gatsby root" : null },
  { name: "Remix", confidence: "medium", test: ({ html }) => html.includes("__remixContext") ? "__remixContext found" : null },

  // Libraries
  { name: "jQuery", confidence: "high", test: ({ $, html }) => $('script[src*="jquery"]').length ? "jQuery script" : html.includes("jQuery") ? "jQuery global" : null },
  { name: "Bootstrap", confidence: "high", test: ({ $ }) => $('link[href*="bootstrap"]').length || $('script[src*="bootstrap"]').length ? "Bootstrap CSS/JS" : null },
  { name: "Tailwind CSS", confidence: "medium", test: ({ html }) => /class="[^"]*\b(flex|grid|text-[a-z]+-\d|bg-[a-z]+-\d|p-\d|m-\d)\b/.test(html) ? "Tailwind utility classes" : null },

  // CMS
  { name: "WordPress", confidence: "high", test: ({ $, html }) => $('meta[name="generator"][content*="WordPress"]').length ? "WordPress generator meta" : html.includes("wp-content") ? "wp-content path" : null },
  { name: "Shopify", confidence: "high", test: ({ html, headers }) => html.includes("Shopify.theme") ? "Shopify.theme" : headers["x-shopid"] ? "x-shopid header" : null },
  { name: "Wix", confidence: "high", test: ({ html }) => html.includes("wix.com") || html.includes("X-Wix") ? "Wix markers" : null },
  { name: "Squarespace", confidence: "high", test: ({ html }) => html.includes("squarespace") ? "Squarespace markers" : null },
  { name: "Ghost", confidence: "high", test: ({ $ }) => $('meta[name="generator"][content*="Ghost"]').length ? "Ghost generator" : null },
  { name: "Drupal", confidence: "high", test: ({ $ }) => $('meta[name="generator"][content*="Drupal"]').length ? "Drupal generator" : null },

  // Analytics & Services
  { name: "Google Analytics", confidence: "high", test: ({ html }) => html.includes("google-analytics.com") || html.includes("gtag") || html.includes("ga(") ? "GA script" : null },
  { name: "Google Tag Manager", confidence: "high", test: ({ html }) => html.includes("googletagmanager.com") ? "GTM script" : null },
  { name: "Cloudflare", confidence: "high", test: ({ headers }) => headers["cf-ray"] || headers["server"]?.toLowerCase().includes("cloudflare") ? "Cloudflare headers" : null },
  { name: "Vercel", confidence: "high", test: ({ headers }) => headers["x-vercel-id"] || headers["server"]?.toLowerCase() === "vercel" ? "Vercel headers" : null },
  { name: "Netlify", confidence: "high", test: ({ headers }) => headers["x-nf-request-id"] || headers["server"]?.toLowerCase() === "netlify" ? "Netlify headers" : null },
  { name: "Hotjar", confidence: "high", test: ({ html }) => html.includes("hotjar.com") ? "Hotjar script" : null },
  { name: "Segment", confidence: "high", test: ({ html }) => html.includes("segment.com/analytics") || html.includes("analytics.js") ? "Segment script" : null },

  // Server
  { name: "Nginx", confidence: "high", test: ({ headers }) => headers["server"]?.toLowerCase().includes("nginx") ? "Server header" : null },
  { name: "Apache", confidence: "high", test: ({ headers }) => headers["server"]?.toLowerCase().includes("apache") ? "Server header" : null },
  { name: "Express", confidence: "medium", test: ({ headers }) => headers["x-powered-by"]?.toLowerCase().includes("express") ? "X-Powered-By" : null },
  { name: "PHP", confidence: "medium", test: ({ headers }) => headers["x-powered-by"]?.toLowerCase().includes("php") ? "X-Powered-By PHP" : null },
  { name: "ASP.NET", confidence: "high", test: ({ headers }) => headers["x-powered-by"]?.toLowerCase().includes("asp.net") || headers["x-aspnet-version"] ? "ASP.NET headers" : null },
];

export function detectTechStack($: CheerioAPI, html: string, headers: Record<string, string>): TechDetection[] {
  const ctx: DetectContext = { $, html, headers };
  const detected: TechDetection[] = [];

  for (const rule of rules) {
    try {
      const evidence = rule.test(ctx);
      if (evidence) {
        detected.push({ name: rule.name, confidence: rule.confidence, evidence });
      }
    } catch {
      // Skip failed detection
    }
  }

  // Generator meta catch-all
  const generator = $('meta[name="generator"]').attr("content");
  if (generator && !detected.some((d) => generator.toLowerCase().includes(d.name.toLowerCase()))) {
    detected.push({ name: generator, confidence: "high", evidence: "meta generator" });
  }

  return detected;
}
