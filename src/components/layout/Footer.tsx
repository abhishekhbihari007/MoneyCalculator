"use client";

import Link from "next/link";
import { Mail, Twitter, Linkedin, Youtube, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const footerLinks = {
  calculators: [
    { name: "In-Hand Salary", href: "/calculator/in-hand-salary" },
    { name: "Tax Regime Picker", href: "/calculator/tax-regime" },
    { name: "SIP Calculator", href: "/calculator/sip" },
    { name: "Retirement Planner", href: "/calculator/retirement" },
    { name: "Gratuity Estimator", href: "/calculator/gratuity" },
  ],
  resources: [
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },
    { name: "Credit Score", href: "/creditscore" },
    { name: "Insurance", href: "/insurance" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "YouTube", icon: Youtube, href: "#" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12 md:py-16">
        {/* Newsletter Section */}
        <div className="mb-12 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                Get Smarter About Money
              </h3>
              <p className="text-muted-foreground text-sm">
                Weekly insights on salary optimization, tax savings, and wealth building. No spam, ever.
              </p>
            </div>
            
            {subscribed ? (
              <div className="flex items-center gap-2 text-success font-medium animate-fade-in">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-foreground text-sm">✓</span>
                You&apos;re subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 md:w-64 rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <Button type="submit" className="shrink-0">
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 flex items-center group">
              <Logo className="h-8 w-auto" />
            </Link>
            <p className="mb-6 max-w-xs text-sm text-muted-foreground">
              Your trusted companion for salary calculations, tax planning, and building long-term wealth. Made with care for Indian professionals.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Calculators */}
          <div>
            <h4 className="mb-4 font-heading font-semibold text-foreground">Calculators</h4>
            <ul className="space-y-2.5">
              {footerLinks.calculators.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-heading font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 font-heading font-semibold text-foreground">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ManageYourSalary. All rights reserved.
            </p>
            <p className="max-w-lg text-xs text-muted-foreground/70 leading-relaxed">
              <strong>Important:</strong> The calculators and content provided here are for educational and informational purposes only. They do not constitute professional financial, tax, or legal advice. Always consult with qualified professionals before making financial decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
