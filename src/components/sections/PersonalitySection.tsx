"use client";

import { useEffect, useState } from "react";
import { Calculator, Receipt, PiggyBank, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const personalities = [
  {
    id: "tax-optimizer",
    name: "TAX OPTIMIZER",
    icon: Receipt,
    score: "High Savings",
    bgColor: "bg-orange-100",
    badgeColor: "bg-orange-500",
    description: "You maximize tax savings and optimize your take-home salary through smart deductions.",
  },
  {
    id: "wealth-builder",
    name: "WEALTH BUILDER",
    icon: PiggyBank,
    score: "Long-term Focus",
    bgColor: "bg-teal-100",
    badgeColor: "bg-teal-500",
    description: "You prioritize building long-term wealth through EPF, NPS, and systematic investments.",
  },
  {
    id: "strategic-planner",
    name: "STRATEGIC PLANNER",
    icon: BarChart3,
    score: "Goal-Oriented",
    bgColor: "bg-blue-100",
    badgeColor: "bg-blue-500",
    description: "You plan your finances strategically, setting clear goals for retirement and major milestones.",
  },
];

const PersonalitySection = () => {
  const [mounted, setMounted] = useState(false);
  const [leftRef, leftVisible] = useScrollAnimation();
  const [rightRef, rightVisible] = useScrollAnimation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="py-20 bg-gradient-to-br from-background to-muted/30 overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 opacity-0">
              {personalities.map((personality) => (
                <div key={personality.id} className="flex items-center gap-4 bg-white rounded-2xl p-6">
                  <div className={`${personality.bgColor} rounded-full w-20 h-20`} />
                  <div className="flex-1 h-16 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
            <div className="space-y-6 opacity-0">
              <div className="h-12 bg-gray-100 rounded" />
              <div className="h-24 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30 overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Personality Profiles */}
          <div 
            ref={leftRef}
            className={`space-y-6 transition-all duration-700 ${leftVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            {personalities.map((personality, index) => (
              <div
                key={personality.id}
                className={`flex items-center gap-4 bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${leftVisible ? 'opacity-100 animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Profile Circle */}
                <div className={`relative ${personality.bgColor} rounded-full w-20 h-20 flex items-center justify-center flex-shrink-0`}>
                  <personality.icon className="h-10 w-10 text-gray-700" />
                  
                  {/* Badge */}
                  <div className={`absolute -top-2 -right-2 ${personality.badgeColor} rounded-lg px-2 py-1 shadow-lg`}>
                    <span className="text-xs font-bold text-white">{personality.name}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{personality.description}</p>
                  <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                    <span className="text-xs font-semibold text-gray-700">{personality.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Text Content */}
          <div 
            ref={rightRef}
            className={`space-y-6 transition-all duration-700 ${rightVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground animate-fade-in-up">
              Discover Your Financial Planning Style
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Every salaried professional has a unique approach to managing money. Understanding your financial planning style helps you make better decisions—from optimizing your tax regime to building long-term wealth that matches your goals.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground group" asChild>
              <a href="#calculators">
                Explore Free Calculators
                <Calculator className="h-5 w-5 ml-2 transition-transform group-hover:scale-110" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalitySection;

