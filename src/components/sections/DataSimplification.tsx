"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { TrendingUp, BarChart3, PieChart, Calculator } from "lucide-react";

const DataSimplification = () => {
  const [leftRef, leftVisible] = useScrollAnimation();
  const [rightRef, rightVisible] = useScrollAnimation();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-white overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div 
            ref={leftRef}
            className={`space-y-6 transition-all duration-700 ${leftVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Simplified calculations for{" "}
              <span className="text-primary">amplified clarity</span>
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              You win at financial planning when you make sense of complex salary structures. 
              We present all the useful calculations in the most simplified manner that helps 
              you separate the financial signals from the noise.
            </p>

            {/* Feature Points */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2 mt-1">
                  <Calculator className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Break Down Complex CTC</p>
                  <p className="text-sm text-gray-600">Understand every component of your salary structure</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-2 mt-1">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Tax Optimization Insights</p>
                  <p className="text-sm text-gray-600">Get clear recommendations for maximum savings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: 3D Animated Funnel Illustration */}
          <div 
            ref={rightRef}
            className={`transition-all duration-700 ${rightVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            <div className="relative w-full h-[400px] flex items-center justify-center perspective-1000">
              {/* Funnel SVG with 3D effects */}
              <svg viewBox="0 0 300 400" className="w-full h-full">
                <defs>
                  {/* 3D Coin Gradient */}
                  <radialGradient id="coinGradient3D" cx="30%" cy="30%">
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                  </radialGradient>
                  
                  {/* 3D Funnel Top Gradient */}
                  <linearGradient id="funnelTop3D" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  
                  {/* 3D Funnel Bottom Gradient */}
                  <linearGradient id="funnelBottom3D" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  
                  {/* 3D Shadow Filter */}
                  <filter id="shadow3D" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="2" dy="4" result="offsetblur"/>
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  
                  {/* Glow effect */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Background orbs with 3D effect */}
                <circle cx="50" cy="80" r="25" fill="#bfdbfe" opacity="0.3">
                  <animate attributeName="r" values="25;28;25" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="250" cy="120" r="20" fill="#bfdbfe" opacity="0.25">
                  <animate attributeName="r" values="20;23;20" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx="80" cy="320" r="18" fill="#bfdbfe" opacity="0.2">
                  <animate attributeName="r" values="18;21;18" dur="3.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="220" cy="280" r="22" fill="#bfdbfe" opacity="0.25">
                  <animate attributeName="r" values="22;25;22" dur="4.5s" repeatCount="indefinite" />
                </circle>

                {/* Small bar chart indicator - top left with pulse */}
                <g transform="translate(20, 30)">
                  <rect x="0" y="12" width="3" height="4" fill="#4b5563">
                    <animate attributeName="height" values="4;6;4" dur="2s" repeatCount="indefinite" />
                  </rect>
                  <rect x="4" y="10" width="3" height="6" fill="#4b5563">
                    <animate attributeName="height" values="6;8;6" dur="2s" begin="0.2s" repeatCount="indefinite" />
                  </rect>
                  <rect x="8" y="8" width="3" height="8" fill="#4b5563">
                    <animate attributeName="height" values="8;10;8" dur="2s" begin="0.4s" repeatCount="indefinite" />
                  </rect>
                  <rect x="12" y="6" width="3" height="10" fill="#4b5563">
                    <animate attributeName="height" values="10;12;10" dur="2s" begin="0.6s" repeatCount="indefinite" />
                  </rect>
                </g>

                {/* Animated Data blocks falling into funnel */}
                <g>
                  {/* Block 1 - falling animation */}
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="100,50; 110,120; 120,180; 130,220"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="0; 15; 0; -15; 0"
                      dur="2s"
                      repeatCount="indefinite"
                      additive="sum"
                    />
                    <rect x="0" y="0" width="8" height="8" fill="#4b5563" rx="1" filter="url(#shadow3D)" />
                  </g>
                  
                  {/* Block 2 - falling with delay */}
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="110,50; 115,120; 120,180; 125,220"
                      dur="2s"
                      begin="0.3s"
                      repeatCount="indefinite"
                    />
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="0; -15; 0; 15; 0"
                      dur="2s"
                      begin="0.3s"
                      repeatCount="indefinite"
                      additive="sum"
                    />
                    <rect x="0" y="0" width="8" height="8" fill="#4b5563" rx="1" filter="url(#shadow3D)" />
                  </g>
                  
                  {/* Block 3 - falling with delay */}
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="100,60; 110,130; 120,190; 130,230"
                      dur="2s"
                      begin="0.6s"
                      repeatCount="indefinite"
                    />
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="0; 20; 0; -20; 0"
                      dur="2s"
                      begin="0.6s"
                      repeatCount="indefinite"
                      additive="sum"
                    />
                    <rect x="0" y="0" width="8" height="8" fill="#4b5563" rx="1" filter="url(#shadow3D)" />
                  </g>
                  
                  {/* Block 4 - falling with delay */}
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="110,60; 115,130; 120,190; 125,230"
                      dur="2s"
                      begin="0.9s"
                      repeatCount="indefinite"
                    />
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="0; -20; 0; 20; 0"
                      dur="2s"
                      begin="0.9s"
                      repeatCount="indefinite"
                      additive="sum"
                    />
                    <rect x="0" y="0" width="8" height="8" fill="#4b5563" rx="1" filter="url(#shadow3D)" />
                  </g>
                </g>

                {/* 3D Funnel with depth */}
                {/* Upper wider part - vibrant green with 3D gradient */}
                <path
                  d="M 80 100 L 220 100 L 200 220 L 100 220 Z"
                  fill="url(#funnelTop3D)"
                  filter="url(#shadow3D)"
                  style={{
                    transform: 'perspective(500px) rotateX(5deg)',
                  }}
                />
                
                {/* 3D side face for depth */}
                <path
                  d="M 220 100 L 200 220 L 200 240 L 220 120 Z"
                  fill="#047857"
                  opacity="0.6"
                />
                
                {/* Lower narrower part - darker green with 3D gradient */}
                <path
                  d="M 100 220 L 200 220 L 180 280 L 120 280 Z"
                  fill="url(#funnelBottom3D)"
                  filter="url(#shadow3D)"
                />
                
                {/* 3D side face for lower part */}
                <path
                  d="M 200 220 L 180 280 L 180 300 L 200 240 Z"
                  fill="#065f46"
                  opacity="0.6"
                />

                {/* Animated Rupee coins - golden yellow with 3D effect, falling out */}
                {/* Coin 1 - rotating and falling */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="130,280; 135,300; 140,320; 145,340"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0; 180; 360"
                    dur="2.5s"
                    repeatCount="indefinite"
                    additive="sum"
                  />
                  <circle cx="0" cy="0" r="12" fill="url(#coinGradient3D)" filter="url(#glow)">
                    <animate attributeName="r" values="12;13;12" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <text x="0" y="4" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">₹</text>
                  {/* 3D highlight */}
                  <ellipse cx="-3" cy="-3" rx="6" ry="3" fill="rgba(255,255,255,0.4)" />
                </g>

                {/* Coin 2 - rotating and falling with delay */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="155,280; 160,300; 165,320; 170,340"
                    dur="2.5s"
                    begin="0.8s"
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="360; 180; 0"
                    dur="2.5s"
                    begin="0.8s"
                    repeatCount="indefinite"
                    additive="sum"
                  />
                  <circle cx="0" cy="0" r="12" fill="url(#coinGradient3D)" filter="url(#glow)">
                    <animate attributeName="r" values="12;13;12" dur="1.5s" begin="0.8s" repeatCount="indefinite" />
                  </circle>
                  <text x="0" y="4" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">₹</text>
                  <ellipse cx="-3" cy="-3" rx="6" ry="3" fill="rgba(255,255,255,0.4)" />
                </g>

                {/* Coin 3 - rotating and falling with delay */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="140,280; 145,300; 150,320; 155,340"
                    dur="2.5s"
                    begin="1.6s"
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0; 180; 360"
                    dur="2.5s"
                    begin="1.6s"
                    repeatCount="indefinite"
                    additive="sum"
                  />
                  <circle cx="0" cy="0" r="12" fill="url(#coinGradient3D)" filter="url(#glow)">
                    <animate attributeName="r" values="12;13;12" dur="1.5s" begin="1.6s" repeatCount="indefinite" />
                  </circle>
                  <text x="0" y="4" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">₹</text>
                  <ellipse cx="-3" cy="-3" rx="6" ry="3" fill="rgba(255,255,255,0.4)" />
                </g>

                {/* Enhanced 3D Shadow/reflection beneath funnel */}
                <ellipse cx="150" cy="360" rx="50" ry="8" fill="#9ca3af" opacity="0.2">
                  <animate attributeName="opacity" values="0.2;0.3;0.2" dur="3s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="150" cy="362" rx="45" ry="6" fill="#9ca3af" opacity="0.15" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataSimplification;

