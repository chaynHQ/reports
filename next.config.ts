import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * next-intl plugin wires up the i18n/request.ts config automatically.
 * The explicit path avoids relying on the default discovery heuristic.
 */
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: "./",
  },
  /* Add future Next.js config options here. */
};

export default withNextIntl(nextConfig);
