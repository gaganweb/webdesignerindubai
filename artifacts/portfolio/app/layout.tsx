import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@/index.css";

const siteUrl = "https://www.webdesignerindubai.ae";
const title = "Best Web Designer in Dubai | Professional Website Creation";
const description =
  "Looking to make a website in Dubai? Get a stunning, fast, and responsive business website tailored for the UAE market. Contact a top Dubai web designer today!";
const socialDescription =
  "Looking to make a website in Dubai? Get a stunning, fast, and responsive business website tailored for the UAE market.";

const structuredData = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  name: "Gagan Dutta Web Design & Development",
  url: siteUrl,
  description:
    "Professional website creation, web design, e-commerce development, and UI/UX services for businesses in Dubai and across the UAE.",
  email: "contact@webdesignerindubai.ae",
  telephone: "+971566530065",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressRegion: "Dubai",
    addressCountry: "AE",
  },
  areaServed: [
    { "@type": "City", name: "Dubai" },
    { "@type": "Country", name: "United Arab Emirates" },
    { "@type": "Place", name: "Worldwide" },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+971566530065",
    email: "contact@webdesignerindubai.ae",
    contactType: "sales",
    areaServed: ["AE", "Worldwide"],
    availableLanguage: ["English", "Arabic"],
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Web Design and Development Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Website Design",
          serviceType: "Custom website design services",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Website Development",
          serviceType: "Next.js, WordPress, and custom website development",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "UI/UX Design",
          serviceType: "Custom user interface and user experience design",
        },
      },
    ],
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "web designer in Dubai",
    "website development Dubai",
    "make a website in Dubai",
    "web design agency UAE",
  ],
  applicationName: "Gagan Dutta Web Design",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.svg?v=2", type: "image/svg+xml", sizes: "any" },
      { url: "/favicon-16.png?v=2", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32.png?v=2", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48.png?v=2", type: "image/png", sizes: "48x48" },
      { url: "/favicon-192.png?v=2", type: "image/png", sizes: "192x192" },
      { url: "/favicon-512.png?v=2", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico?v=2", type: "image/x-icon", sizes: "16x16 32x32 48x48" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [{ url: "/favicon-180.png?v=2", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Gagan Dutta Web Design",
    title,
    description: socialDescription,
    images: [
      {
        url: "/opengraph.jpg",
        width: 1200,
        height: 630,
        alt: "Web design project for a Dubai business by Gagan Dutta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: socialDescription,
    images: ["/opengraph.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f8fafc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}