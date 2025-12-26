"use client";

import { useEffect, useState } from "react";
import { TrendingUp, BarChart3, PieChart, FileSpreadsheet, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const FeaturePromo = () => {
  const [mounted, setMounted] = useState(false);
  const [textRef, textVisible] = useScrollAnimation();
  const [visualRef, visualVisible] = useScrollAnimation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 opacity-0">
              <div className="h-12 bg-gray-100 rounded" />
              <div className="h-24 bg-gray-100 rounded" />
            </div>
            <div className="h-[500px] opacity-0" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div 
            ref={textRef}
            className={`space-y-6 transition-all duration-700 ${textVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground animate-fade-in-up">
              Simplified data for amplified returns
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              You win at investing when you make sense of complex data. ManageYourSalary presents you all the useful data in the most simplified manner that helps you separate the investing signals from the noise.
            </p>
            <Button size="lg" className="group">
              Explore Calculators
              <TrendingUp className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Right: Visual Funnel Graphic */}
          <div 
            ref={visualRef}
            className={`relative h-[500px] flex items-center justify-center transition-all duration-700 ${visualVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl animate-pulse-slow" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            </div>

            {/* Funnel Container */}
            <div className="relative z-10 w-full max-w-md">
              {/* Data Input Icons - Top */}
              <div className="flex justify-center gap-4 mb-4">
                <div 
                  className={`bg-white rounded-lg p-3 shadow-lg transform transition-all duration-500 hover:scale-110 hover:rotate-0 ${visualVisible ? 'opacity-100 rotate-6 animate-bounce-in' : 'opacity-0 rotate-0'}`}
                  style={{ animationDelay: '0.2s' }}
                >
                  <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                </div>
                <div 
                  className={`bg-white rounded-lg p-3 shadow-lg transform transition-all duration-500 hover:scale-110 hover:rotate-0 ${visualVisible ? 'opacity-100 -rotate-6 animate-bounce-in' : 'opacity-0 rotate-0'}`}
                  style={{ animationDelay: '0.4s' }}
                >
                  <PieChart className="h-8 w-8 text-pink-600" />
                </div>
                <div 
                  className={`bg-white rounded-lg p-3 shadow-lg transform transition-all duration-500 hover:scale-110 hover:rotate-0 ${visualVisible ? 'opacity-100 rotate-3 animate-bounce-in' : 'opacity-0 rotate-0'}`}
                  style={{ animationDelay: '0.6s' }}
                >
                  <BarChart3 className="h-8 w-8 text-yellow-600" />
                </div>
              </div>

              {/* Funnel Shape */}
              <div 
                className={`relative mx-auto transition-all duration-700 ${visualVisible ? 'opacity-100 animate-scale-up' : 'opacity-0 scale-90'}`}
                style={{ width: '200px', height: '300px', animationDelay: '0.8s' }}
              >
                <svg viewBox="0 0 200 300" className="w-full h-full">
                  {/* Funnel Path */}
                  <path
                    d="M 20 0 L 180 0 L 160 280 L 40 280 Z"
                    fill="url(#funnelGradient)"
                    className="drop-shadow-2xl"
                  />
                  <defs>
                    <linearGradient id="funnelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Rupee Coins Output - Bottom */}
              <div className="flex justify-center gap-3 mt-4">
                <div 
                  className={`bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg transform transition-all duration-500 hover:scale-125 hover:rotate-12 ${visualVisible ? 'opacity-100 animate-bounce-in' : 'opacity-0 scale-0'}`}
                  style={{ animationDelay: '1.2s' }}
                >
                  <span className="text-2xl font-bold text-white">₹</span>
                </div>
                <div 
                  className={`bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg transform transition-all duration-500 hover:scale-125 hover:rotate-12 ${visualVisible ? 'opacity-100 animate-bounce-in' : 'opacity-0 scale-0'}`}
                  style={{ animationDelay: '1.4s' }}
                >
                  <span className="text-2xl font-bold text-white">₹</span>
                </div>
                <div 
                  className={`bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg transform transition-all duration-500 hover:scale-125 hover:rotate-12 ${visualVisible ? 'opacity-100 animate-bounce-in' : 'opacity-0 scale-0'}`}
                  style={{ animationDelay: '1.6s' }}
                >
                  <span className="text-2xl font-bold text-white">₹</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturePromo;

