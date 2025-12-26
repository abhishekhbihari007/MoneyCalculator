"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const CTABanner = () => {
  const [ref, visible] = useScrollAnimation();

  return (
    <section className="py-16 bg-gradient-to-r from-primary via-primary/95 to-primary overflow-hidden relative">
      {/* Decorative dots pattern - right side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20">
        <svg width="250" height="120" viewBox="0 0 250 120" className="w-full h-full">
          {/* Top row - full circles */}
          <g>
            {Array.from({ length: 15 }).map((_, col) => (
              <circle
                key={col}
                cx={col * 15 + 10}
                cy={20}
                r="3"
                fill="white"
                opacity="0.5"
              />
            ))}
          </g>
          {/* Middle row - full circles */}
          <g>
            {Array.from({ length: 16 }).map((_, col) => (
              <circle
                key={col}
                cx={col * 14 + 5}
                cy={60}
                r="3"
                fill="white"
                opacity="0.5"
              />
            ))}
          </g>
          {/* Bottom row - semi-circles/crescents */}
          <g>
            {Array.from({ length: 15 }).map((_, col) => (
              <path
                key={col}
                d={`M ${col * 15 + 10} 100 A 3 3 0 0 1 ${col * 15 + 10} 106`}
                fill="white"
                opacity="0.4"
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="container relative z-10">
        <div 
          ref={ref}
          className={`flex items-center justify-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Center: Text and CTA */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Start your financial planning journey today.
            </h2>
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-50 px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-gray-300"
                asChild
              >
                <Link href="/calculator/in-hand-salary">
                  Calculate Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;

