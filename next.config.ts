import type { NextConfig } from "next";

/**
 * CSP : on autorise 'unsafe-inline' et 'unsafe-eval' pour les scripts.
 * Next.js App Router injecte des scripts inline pour sérialiser les données
 * RSC vers le client. Sans 'unsafe-inline', l'hydration tombe silencieusement.
 *
 * TODO phase 7 (sécurité) : passer à un CSP avec nonces via middleware Next.js
 * pour retirer 'unsafe-inline'. Pas urgent au MVP, plus complexe à mettre en
 * place et à maintenir avec les Server Components.
 */
const ContentSecurityPolicy = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://*.neon.tech https://*.vercel.app https://*.sentry.io ws://localhost:* http://localhost:*",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
