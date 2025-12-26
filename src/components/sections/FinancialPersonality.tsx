"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Calculator, TrendingUp, Shield, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const personalities = [
  {
    id: "tax-optimizer",
    name: "Tax Optimizer",
    icon: Calculator,
    score: "40-65",
    bgGradient: "from-orange-400 to-orange-600",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-600",
    badgeColor: "bg-orange-500",
    description: "Maximize tax savings through smart salary structuring",
    features: ["Tax deductions", "HRA optimization", "Section 80C benefits"],
  },
  {
    id: "wealth-builder",
    name: "Wealth Builder",
    icon: TrendingUp,
    score: "45-60",
    bgGradient: "from-green-400 to-green-600",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600",
    badgeColor: "bg-green-500",
    description: "Focus on long-term wealth through EPF, NPS, and SIPs",
    features: ["EPF growth", "NPS planning", "SIP investments"],
  },
  {
    id: "safety-first",
    name: "Safety First",
    icon: Shield,
    score: "30-55",
    bgGradient: "from-blue-400 to-blue-600",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
    badgeColor: "bg-blue-500",
    description: "Prioritize financial security and guaranteed returns",
    features: ["Guaranteed returns", "Low risk", "Stable growth"],
  },
];

const FinancialPersonality = () => {
  const [ref, visible] = useScrollAnimation();

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-white overflow-hidden">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Financial Planning Styles</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Your{" "}
            <span className="text-primary">Financial Planning Style</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every professional has a unique approach to managing finances. Find your style and 
            use our calculators to optimize your salary, taxes, and investments accordingly.
          </p>
        </div>

        {/* Personality Cards - Horizontal Layout */}
        <div 
          ref={ref}
          className={`grid md:grid-cols-3 gap-6 mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {personalities.map((personality, index) => (
            <div
              key={personality.id}
              className="group relative bg-white rounded-xl p-6 border border-gray-200 
                hover:border-gray-300 transition-all duration-300 
                hover:shadow-xl hover:-translate-y-2"
            >
              {/* Gradient accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${personality.bgGradient} rounded-t-xl`} />
              
              <div className="flex flex-col h-full">
                {/* Icon and Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${personality.iconBg} rounded-lg p-3 flex-shrink-0`}>
                    <personality.icon className={`h-6 w-6 ${personality.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{personality.name}</h3>
                    <p className="text-sm text-gray-600">{personality.description}</p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-4 flex-1">
                  {personality.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className={`w-1.5 h-1.5 rounded-full ${personality.badgeColor}`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Risk Score Badge */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Risk Score</span>
                  <div className={`${personality.badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                    {personality.score}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Ready to optimize your finances?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Use our comprehensive calculators to understand your salary breakdown, 
            maximize tax savings, and plan for a secure financial future.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            asChild
          >
            <Link href="/calculator/tax-regime">
              Explore All Calculators
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinancialPersonality;

