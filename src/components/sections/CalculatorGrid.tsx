"use client";

import { useState } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { 
  Wallet, 
  Receipt, 
  TrendingUp, 
  Scale,
  Shield,
  Heart,
  Landmark,
  Award,
  PiggyBank,
  Target,
  Clock,
  BarChart3,
  Home,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Zap
} from "lucide-react";

const categories = [
  {
    id: "salary",
    title: "Salary & Tax Tools",
    description: "Decode your paycheck and optimize your tax outflow",
    color: "bg-primary/10 text-primary border-primary/20",
    hoverColor: "hover:border-primary/50",
    calculators: [
      { name: "In-Hand Salary", icon: Wallet, description: "See what lands in your bank after all deductions", popular: true },
      { name: "Tax Regime Picker", icon: Receipt, description: "Old or new regime? Find your best fit instantly" },
      { name: "Salary Growth Tracker", icon: TrendingUp, description: "Measure your career growth over the years" },
      { name: "Offer Analyzer", icon: Scale, description: "Compare multiple job offers side by side" },
    ],
  },
  {
    id: "protection",
    title: "Protection Planning",
    description: "Safeguard yourself and your loved ones",
    color: "bg-destructive/10 text-destructive border-destructive/20",
    hoverColor: "hover:border-destructive/50",
    calculators: [
      { name: "Life Cover Estimator", icon: Shield, description: "Calculate the right protection for your family", popular: true },
      { name: "Medical Cover Planner", icon: Heart, description: "Find adequate health coverage for your needs" },
    ],
  },
  {
    id: "wealth",
    title: "Wealth Builders",
    description: "Turn your income into lasting wealth",
    color: "bg-success/10 text-success border-success/20",
    hoverColor: "hover:border-success/50",
    calculators: [
      { name: "EPF Accumulator", icon: Landmark, description: "Project your provident fund growth trajectory" },
      { name: "Gratuity Estimator", icon: Award, description: "Know your service reward before you retire" },
      { name: "NPS Wealth Builder", icon: PiggyBank, description: "Plan your national pension contributions", popular: true },
      { name: "Retirement Mapper", icon: Target, description: "Chart your path to financial freedom" },
      { name: "Pension Projector", icon: Clock, description: "Estimate your monthly pension income" },
      { name: "Investment Goal Planner", icon: BarChart3, description: "Work backwards from your financial goals" },
      { name: "SIP Growth Calculator", icon: TrendingUp, description: "See the power of consistent investing" },
    ],
  },
  {
    id: "planning",
    title: "Smart Decisions",
    description: "Make informed choices for major life decisions",
    color: "bg-accent/10 text-accent border-accent/20",
    hoverColor: "hover:border-accent/50",
    calculators: [
      { name: "Safety Net Builder", icon: AlertCircle, description: "Calculate your ideal emergency fund size" },
      { name: "Rent vs Own Analyzer", icon: Home, description: "Should you buy or continue renting?", popular: true },
    ],
  },
];

const getCalculatorLink = (name: string): string => {
  const linkMap: Record<string, string> = {
    "In-Hand Salary": "/calculator/in-hand-salary",
    "Tax Regime Picker": "/calculator/tax-regime",
    "Salary Growth Tracker": "/calculator/salary-growth",
    "Offer Analyzer": "/calculator/offer-analyzer",
    "Life Cover Estimator": "/insurance",
    "Medical Cover Planner": "/insurance",
    "EPF Accumulator": "/calculator/epf",
    "Gratuity Estimator": "/calculator/gratuity",
    "NPS Wealth Builder": "/calculator/nps",
    "Retirement Mapper": "/calculator/retirement",
    "Pension Projector": "/calculator/retirement",
    "Investment Goal Planner": "/calculator/sip",
    "SIP Growth Calculator": "/calculator/sip",
    "Safety Net Builder": "/calculator/retirement",
    "Rent vs Own Analyzer": "/calculator/rent-vs-own",
  };
  return linkMap[name] || "/calculator/in-hand-salary";
};

const CalculatorGrid = () => {
  const [activeCategory, setActiveCategory] = useState("salary");
  const [hoveredCalc, setHoveredCalc] = useState<string | null>(null);
  const [headerRef, headerVisible] = useScrollAnimation();

  return (
    <section id="calculators" className="gradient-section py-20 overflow-hidden">
      <div className="container">
        {/* Section Header */}
        <div 
          ref={headerRef}
          className={`mx-auto mb-12 max-w-2xl text-center transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              100% Free Forever
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-1.5 text-sm font-medium text-success">
              <Zap className="h-4 w-4" />
              No Login Required
            </span>
          </div>
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
            Your Financial Toolkit
          </h2>
          <p className="text-lg text-muted-foreground">
            Purpose-built calculators designed for the Indian salaried professional. 
            No signups, no hidden fees—just instant answers.
          </p>
        </div>

        {/* Interactive Category Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? `${cat.color} shadow-md scale-105`
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Calculator Cards */}
        {categories.map((category) => (
          <div
            key={category.id}
            className={`transition-all duration-300 ${
              activeCategory === category.id ? "block animate-fade-in" : "hidden"
            }`}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className={`rounded-lg border px-4 py-2 ${category.color}`}>
                <span className="font-heading text-sm font-bold">{category.title}</span>
              </div>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.calculators.map((calc, calcIndex) => (
                <a
                  key={calc.name}
                  href={getCalculatorLink(calc.name)}
                  className={`group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all duration-500 ${category.hoverColor} hover:shadow-xl hover:-translate-y-2 hover:scale-105 ${headerVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${calcIndex * 0.1}s` }}
                  onMouseEnter={() => setHoveredCalc(calc.name)}
                  onMouseLeave={() => setHoveredCalc(null)}
                >
                  {calc.popular && (
                    <span className="absolute top-3 right-3 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                      Popular
                    </span>
                  )}
                  
                  <div className="mb-3 flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${category.color}`}>
                      <calc.icon className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <h3 className="mb-2 font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {calc.description}
                  </p>
                  
                  <div className={`flex items-center gap-1 text-sm font-medium transition-all ${
                    hoveredCalc === calc.name ? "text-primary translate-x-1" : "text-muted-foreground"
                  }`}>
                    Try Now <ChevronRight className="h-4 w-4" />
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute -bottom-2 -right-2 h-20 w-20 rounded-full bg-primary/5 transition-all duration-300 group-hover:scale-[3] group-hover:bg-primary/10" />
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* View All Link */}
        <div className="mt-10 text-center">
          <a
            href="#calculators"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline group"
            onClick={(e) => {
              e.preventDefault();
              // Scroll to calculators section (already on page)
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Explore all {categories.reduce((sum, cat) => sum + cat.calculators.length, 0)}+ calculators
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CalculatorGrid;
