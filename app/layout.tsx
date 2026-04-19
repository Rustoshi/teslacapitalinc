import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import SmartsuppChat from "@/components/SmartsuppChat";
import GTranslateWidget from "@/components/GTranslateWidget";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Tesla Capital Inc | Invest in the Future",
    template: "%s | Tesla Capital Inc",
  },
  description:
    "Gain exposure to Tesla, SpaceX, Neuralink, xAI, and The Boring Company — the companies shaping humanity's next chapter.",
  keywords: [
    "Tesla Capital Inc",
    "invest",
    "Tesla",
    "SpaceX",
    "Neuralink",
    "xAI",
    "The Boring Company",
    "digital assets",
    "investment platform",
  ],
  authors: [{ name: "Tesla Capital Inc" }],
  creator: "Tesla Capital Inc",
  publisher: "Tesla Capital Inc",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Tesla Capital Inc",
    title: "Tesla Capital Inc | Invest in the Future",
    description:
      "Gain exposure to Tesla, SpaceX, Neuralink, xAI, and The Boring Company — the companies shaping humanity's next chapter.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tesla Capital Inc — Invest in the Future",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tesla Capital Inc | Invest in the Future",
    description:
      "Gain exposure to Tesla, SpaceX, Neuralink, xAI, and The Boring Company.",
    images: ["/og-image.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${montserrat.variable} ${inter.className} antialiased bg-black text-white w-full max-w-[100vw] overflow-x-hidden`}
      >
        <AuthProvider>
          <div className="relative w-full max-w-[100vw] overflow-x-hidden flex flex-col min-h-screen">
            {children}
          </div>
          <SmartsuppChat />
          <GTranslateWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
