export const siteConfig = {
  name: "Proppi",
  description: "AI-powered real estate photo editor",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://www.proppi.tech",

  // Email settings
  email: {
    from: "noreply@updates.proppi.tech",
    replyTo: "christer@proppi.tech",
  },

  // Links
  links: {
    dashboard: "/dashboard",
    settings: "/dashboard/settings",
    help: "/help",
  },
} as const;

export type SiteConfig = typeof siteConfig;
