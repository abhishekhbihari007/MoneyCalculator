"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShaderBackground } from "@/components/neural-network-hero";

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState<"calculate" | "grow">("calculate");

  return (
    <section 
      className="relative min-h-screen pb-0 pt-0 overflow-x-hidden flex items-center justify-center" 
      style={{ 
        position: 'relative',
        width: '100vw',
        minWidth: '100vw',
        maxWidth: '100vw',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        overflow: 'hidden'
      }}
    >
      <ShaderBackground />
      
      <div className="container relative z-10 flex items-center justify-center mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        <div className="mx-auto max-w-4xl text-center w-full">
          <h1 className="mb-4 font-heading text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl text-center">
            <span className="inline-block animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Take Control of
            </span>
            <span className="relative inline-block animate-fade-up" style={{ animationDelay: "0.2s", marginLeft: "0.25em" }}>
              <span className="relative z-10 text-accent">Every Rupee</span>
              <span className="absolute -bottom-1 left-0 h-3 w-full bg-accent/30 -rotate-1 rounded animate-pulse" />
            </span>{" "}
            <span className="inline-block animate-fade-up" style={{ animationDelay: "0.3s" }}>
              You Earn
            </span>
          </h1>

          <p className="mx-auto mb-6 max-w-2xl text-lg text-white/80 md:text-xl animate-fade-up text-center" style={{ animationDelay: "0.4s" }}>
            From understanding your actual take-home pay to building long-term wealth—we provide 
            the tools and insights you need to make every financial decision count.
          </p>

          <div className="mb-6 inline-flex rounded-full bg-white/10 p-1 backdrop-blur-sm animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <button
              onClick={() => setActiveTab("calculate")}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                activeTab === "calculate" 
                  ? "bg-white text-slate-900 shadow-lg" 
                  : "text-white/80 hover:text-white"
              }`}
            >
              <Calculator className={`h-4 w-4 ${activeTab === "calculate" ? "text-slate-900" : "text-white/80"}`} />
              Calculate Salary
            </button>
            <button
              onClick={() => setActiveTab("grow")}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                activeTab === "grow" 
                  ? "bg-white text-slate-900 shadow-lg" 
                  : "text-white/80 hover:text-white"
              }`}
            >
              <TrendingUp className={`h-4 w-4 ${activeTab === "grow" ? "text-slate-900" : "text-white/80"}`} />
              Grow Wealth
            </button>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up" style={{ animationDelay: "0.6s" }}>
            {activeTab === "calculate" ? (
              <>
                <Button variant="hero" size="xl" className="group bg-white/10 text-white border-white/10 hover:bg-white/20 backdrop-blur-sm" asChild>
                  <Link href="/calculator/in-hand-salary">
                    <Calculator className="h-5 w-5" />
                    In-Hand Salary Calculator
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" className="group border-white/10 text-white/80 hover:bg-white/5" asChild>
                  <Link href="/calculator/salary-growth">
                    <TrendingUp className="h-5 w-5" />
                    Salary Hike Estimator
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="hero" size="xl" className="group bg-white/10 text-white border-white/10 hover:bg-white/20 backdrop-blur-sm" asChild>
                  <Link href="/calculator/retirement">
                    <TrendingUp className="h-5 w-5" />
                    Retirement Planner
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" className="group border-white/10 text-white/80 hover:bg-white/5" asChild>
                  <Link href="/calculator/sip">
                    <Calculator className="h-5 w-5" />
                    SIP Returns Calculator
                  </Link>
                </Button>
              </>
            )}
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 sm:gap-8 animate-fade-up" style={{ animationDelay: "0.7s" }}>
            {[
              { value: "15", label: "Free Calculators", growth: "All tools available" },
              { value: "Zero", label: "Signup Required", growth: "Start instantly" },
              { value: "Instant", label: "Results", growth: "Real-time calculations" },
            ].map((stat, index) => (
              <div
                key={index}
                className="group rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all cursor-pointer hover:scale-105"
              >
                <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="text-sm text-white/60">{stat.label}</p>
                <p className="mt-1 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">{stat.growth}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
