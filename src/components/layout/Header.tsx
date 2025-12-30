"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Calculator, BookOpen, GraduationCap, CreditCard, Shield, Wallet, Receipt, TrendingUp, Scale, Heart, Landmark, Award, PiggyBank, Target, Clock, BarChart3, AlertCircle, Home, ChevronDown, Coins, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const calculatorSections = [
  {
    title: "Salary & Tax Tools",
    calculators: [
      { name: "In-Hand Salary", href: "/calculator/in-hand-salary", icon: Wallet },
      { name: "Tax Regime Picker", href: "/calculator/tax-regime", icon: Receipt },
      { name: "Salary Growth Tracker", href: "/calculator/salary-growth", icon: TrendingUp },
      { name: "Offer Analyzer", href: "/calculator/offer-analyzer", icon: Scale },
    ],
  },
  {
    title: "Protection Planning",
    calculators: [
      { name: "Term Insurance Calculator", href: "/calculator/term-insurance", icon: Shield },
      { name: "Health Insurance Calculator", href: "/calculator/health-insurance", icon: Heart },
    ],
  },
  {
    title: "Wealth Builders",
    calculators: [
      { name: "EPF Accumulator", href: "/calculator/epf", icon: Landmark },
      { name: "EPS Pension Calculator", href: "/calculator/eps", icon: Landmark },
      { name: "Gratuity Estimator", href: "/calculator/gratuity", icon: Award },
      { name: "NPS Wealth Builder", href: "/calculator/nps", icon: PiggyBank },
      { name: "Retirement Mapper", href: "/calculator/retirement", icon: Target },
      { name: "SIP Growth Calculator", href: "/calculator/sip", icon: TrendingUp },
      { name: "RD Calculator", href: "/calculator/rd", icon: PiggyBank },
      { name: "FD Calculator", href: "/calculator/fd", icon: Coins },
    ],
  },
  {
    title: "Smart Decisions",
    calculators: [
      { name: "Rent vs Own Analyzer", href: "/calculator/rent-vs-own", icon: Home },
    ],
  },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);


  const navLinks = [
    { name: "Creditscore", href: "/creditscore", icon: CreditCard },
    { name: "Insurance", href: "/insurance", icon: Shield },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Learn", href: "/learn", icon: GraduationCap },
  ];


  return (
    <header 
      className="sticky top-0 left-0 right-0 z-[100] w-full border-b border-border/50 bg-white/95 dark:bg-background/95 backdrop-blur-md shadow-sm"
    >
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
          {/* Calculator Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsCalculatorOpen(true)}
            onMouseLeave={() => setIsCalculatorOpen(false)}
          >
            <button
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Calculator className="h-4 w-4" />
              Calculator
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isCalculatorOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown Menu */}
            {isCalculatorOpen && (
              <div 
                className="absolute top-full left-0 pt-2 w-[600px] z-50"
                onMouseEnter={() => setIsCalculatorOpen(true)}
                onMouseLeave={() => setIsCalculatorOpen(false)}
              >
                <div className="bg-popover border border-border rounded-lg shadow-lg p-6">
                  <div className="grid grid-cols-2 gap-6">
                    {calculatorSections.map((section, idx) => (
                      <div key={idx} className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                          {section.title}
                        </h3>
                        <div className="space-y-1">
                          {section.calculators.map((calc) => (
                            <Link
                              key={calc.name}
                              href={calc.href}
                              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors group cursor-pointer"
                              onClick={() => setIsCalculatorOpen(false)}
                            >
                              <calc.icon className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                              <span>{calc.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

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
          <Link href="/calculator/in-hand-salary">
            <Button size="lg" className="group">
              Start Planning
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Button>
          </Link>
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
        <div className="border-t border-border bg-white dark:bg-background md:hidden animate-fade-in">
          <div className="container py-4 space-y-2">
            {/* Calculator Section in Mobile */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-foreground">
                <Calculator className="h-5 w-5 text-primary" />
                Calculators
              </div>
              {calculatorSections.map((section, idx) => (
                <div key={idx} className="pl-8 space-y-1">
                  <div className="text-xs font-medium text-muted-foreground px-4 py-1">
                    {section.title}
                  </div>
                  {section.calculators.map((calc) => (
                    <Link
                      key={calc.name}
                      href={calc.href}
                      className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <calc.icon className="h-4 w-4 text-primary" />
                      {calc.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            
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
              <Link href="/calculator/in-hand-salary" className="w-full block">
                <Button className="w-full" size="lg">
                  Start Planning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
