"use client";

import { useState, useEffect } from "react";
import { ArrowRight, TrendingUp, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const CalculatorPromo = () => {
  const [displayValue, setDisplayValue] = useState("0");
  const [isCalculating, setIsCalculating] = useState(false);
  const [leftRef, leftVisible] = useScrollAnimation();
  const [rightRef, rightVisible] = useScrollAnimation();

  // Animate calculator display
  useEffect(() => {
    if (!leftVisible) return;

    const sequence = [
      { value: "7", delay: 500 },
      { value: "71", delay: 800 },
      { value: "7,100", delay: 1100 },
      { value: "7,100 × 12", delay: 1400 },
      { value: "Calculating...", delay: 1700, isCalc: true },
      { value: "₹1.43 Cr", delay: 2500 },
    ];

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const showNext = () => {
      if (currentIndex < sequence.length) {
        const step = sequence[currentIndex];
        setIsCalculating(step.isCalc || false);
        setDisplayValue(step.value);
        timeoutId = setTimeout(() => {
          currentIndex++;
          showNext();
        }, step.delay);
      } else {
        // Loop back to start
        setTimeout(() => {
          currentIndex = 0;
          showNext();
        }, 2000);
      }
    };

    showNext();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [leftVisible]);


  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-white overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Interactive Calculator Card */}
          <div 
            ref={leftRef}
            className={`transition-all duration-700 ${leftVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Animated Calculator Model */}
              <div className="mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
                  {/* Calculator Display */}
                  <div className="bg-gray-900 rounded-lg p-4 mb-4 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <Calculator className="h-5 w-5 text-green-400" />
                      <span className="text-xs text-green-400 font-mono">CALCULATING</span>
                    </div>
                    <div className="bg-gray-800 rounded px-4 py-3 min-h-[60px] flex items-center justify-end">
                      <div className={`text-right font-mono text-2xl font-bold text-green-400 transition-all duration-300 ${isCalculating ? 'animate-pulse' : ''}`}>
                        {displayValue}
                      </div>
                    </div>
                  </div>

                  {/* Calculator Buttons Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      ['7', '8', '9', '÷'],
                      ['4', '5', '6', '×'],
                      ['1', '2', '3', '-'],
                      ['C', '0', '=', '+'],
                    ].map((row, rowIndex) => (
                      <div key={rowIndex} className="flex gap-2">
                        {row.map((btn, btnIndex) => {
                          const isOperator = ['÷', '×', '-', '+', '='].includes(btn);
                          const isSpecial = btn === 'C' || btn === '=';
                          return (
                            <button
                              key={btnIndex}
                              className={`
                                flex-1 h-12 rounded-lg font-semibold text-lg
                                transition-all duration-200 transform
                                ${isOperator || isSpecial
                                  ? 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                                  : 'bg-white text-gray-800 hover:bg-gray-50 active:scale-95 border border-gray-200'
                                }
                                ${btn === '=' ? 'col-span-1' : ''}
                                shadow-md hover:shadow-lg
                              `}
                            >
                              {btn}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Animated Number Entry Indicator */}
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-500 ${
                            isCalculating && i <= 2 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                          }`}
                          style={{
                            animationDelay: `${i * 200}ms`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="ml-2">Processing calculation...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Marketing Content */}
          <div 
            ref={rightRef}
            className={`space-y-6 transition-all duration-700 ${rightVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Get there where you want with{" "}
              <span className="text-primary">Suitable calculator</span> options
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Whoever you are and wherever you want to reach in life, our goal-based, 
              suitability-led financial calculators help you get there with clarity and confidence.
            </p>

            <div className="pt-4">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link href="/calculator/sip">
                  Explore Calculators
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Additional Benefits */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2 mt-1">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Goal-Based Planning</p>
                  <p className="text-sm text-gray-600">Plan for specific financial goals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-2 mt-1">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Instant Results</p>
                  <p className="text-sm text-gray-600">Get calculations in seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorPromo;

