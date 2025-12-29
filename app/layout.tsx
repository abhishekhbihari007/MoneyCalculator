import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  preload: false,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://manageyoursalary.com'),
  title: {
    default: "ManageYourSalary - Take Control of Every Rupee You Earn | Free Salary Calculators",
    template: "%s | ManageYourSalary"
  },
  description: "Free salary calculators for Indian professionals. Calculate in-hand salary, compare tax regimes, plan retirement, and build wealth with our easy-to-use financial tools.",
  keywords: "salary calculator india, in-hand salary calculator, ctc calculator, tax calculator, nps calculator, gratuity calculator, epf calculator, retirement planner, sip calculator, term insurance calculator, health insurance calculator",
  authors: [{ name: "ManageYourSalary" }],
  creator: "ManageYourSalary",
  publisher: "ManageYourSalary",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://manageyoursalary.com",
    siteName: "ManageYourSalary",
    title: "ManageYourSalary - Free Salary & Wealth Management Tools",
    description: "Take control of every rupee you earn with our free calculators for salary, tax, and retirement planning.",
    images: [
      {
        url: "https://manageyoursalary.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "ManageYourSalary - Financial Calculators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ManageYourSalary - Take Control of Every Rupee",
    description: "Free salary calculators and wealth planning tools for Indian professionals.",
    images: ["https://manageyoursalary.com/og-image.png"],
    creator: "@manageyoursalary",
  },
  alternates: {
    canonical: "https://manageyoursalary.com",
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ManageYourSalary",
              "url": "https://manageyoursalary.com",
              "description": "Free salary calculators and financial planning tools for Indian professionals",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://manageyoursalary.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ManageYourSalary",
              "url": "https://manageyoursalary.com",
              "logo": "https://manageyoursalary.com/logo.png",
              "description": "Free financial calculators for Indian professionals",
              "sameAs": [
                "https://twitter.com/manageyoursalary",
                "https://linkedin.com/company/manageyoursalary"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased`}>
        <Providers>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
