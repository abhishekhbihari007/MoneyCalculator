'use client';

import { useEffect } from 'react';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { Calculator, TrendingUp, DollarSign, PieChart } from 'lucide-react';

const HeroSectionScrollExpansion = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1280&auto=format&fit=crop"
      bgImageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1920&auto=format&fit=crop"
      title="Take Control Every Rupee"
      date="Smart Salary Management"
      scrollToExpand="Scroll to explore our tools"
      textBlend={false}
    >
      <div className="max-w-4xl mx-auto bg-background/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-accent/50 transition-colors">
            <Calculator className="h-10 w-10 text-accent mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-foreground">In-Hand Salary Calculator</h3>
            <p className="text-muted-foreground">
              Calculate your actual take-home salary after all deductions. Understand your CTC breakdown and plan your finances better.
            </p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-accent/50 transition-colors">
            <TrendingUp className="h-10 w-10 text-accent mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-foreground">Wealth Building Tools</h3>
            <p className="text-muted-foreground">
              Plan for retirement, calculate SIP returns, and build long-term wealth with our comprehensive financial planning tools.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-accent/50 transition-colors">
            <DollarSign className="h-10 w-10 text-accent mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-foreground">Tax Regime Comparison</h3>
            <p className="text-muted-foreground">
              Compare old vs new tax regimes and choose the one that saves you the most money based on your income and investments.
            </p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-accent/50 transition-colors">
            <PieChart className="h-10 w-10 text-accent mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-foreground">Financial Education</h3>
            <p className="text-muted-foreground">
              Learn about salary components, tax planning, investments, and financial best practices through our comprehensive guides.
            </p>
          </div>
        </div>
      </div>
    </ScrollExpandMedia>
  );
};

export default HeroSectionScrollExpansion;

