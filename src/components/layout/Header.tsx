"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Calculator, BookOpen, GraduationCap, CreditCard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Calculator", href: "/calculator/in-hand-salary", icon: Calculator },
    { name: "Credit Score", href: "/creditscore", icon: CreditCard },
    { name: "Insurance", href: "/insurance", icon: Shield },
    { name: "Blog", href: "#blog", icon: BookOpen },
    { name: "Learn", href: "#knowledge", icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Logo className="h-12 w-12 transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground font-heading">ManageYourSalary</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Smart Financial Planning</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground hover:scale-105"
            >
              <link.icon className="h-4 w-4" />
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button size="lg" className="group">
            Start Planning
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-muted md:hidden transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background md:hidden animate-fade-in">
          <div className="container py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <link.icon className="h-5 w-5 text-primary" />
                {link.name}
              </a>
            ))}
            <div className="pt-2">
              <Button className="w-full" size="lg">
                Start Planning
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
