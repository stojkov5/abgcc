const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://abgcc.org";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/portal/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
