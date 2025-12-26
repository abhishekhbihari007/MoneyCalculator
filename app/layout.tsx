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
  preload: false, // Only preload primary font
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  title: "ManageYourSalary - Take Control of Every Rupee You Earn | Free Salary Calculators",
  description: "Free salary calculators for Indian professionals. Calculate in-hand salary, compare tax regimes, plan retirement, and build wealth with our easy-to-use financial tools.",
  keywords: "salary calculator india, in-hand salary calculator, ctc calculator, tax calculator, nps calculator, gratuity calculator, epf calculator, retirement planner",
  authors: [{ name: "ManageYourSalary" }],
  robots: "index, follow",
  openGraph: {
    title: "ManageYourSalary - Free Salary & Wealth Management Tools",
    description: "Take control of every rupee you earn with our free calculators for salary, tax, and retirement planning.",
    type: "website",
    url: "https://manageyoursalary.com",
    images: [
      {
        url: "https://manageyoursalary.com/og-image.png",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ManageYourSalary - Take Control of Every Rupee",
    description: "Free salary calculators and wealth planning tools for Indian professionals.",
    images: ["https://manageyoursalary.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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

