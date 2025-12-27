"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Sparkles, MapPin, Coins, CheckCircle2 } from "lucide-react";

const WhyYoullLoveOurTools = () => {
  const [titleRef, titleVisible] = useScrollAnimation();
  const [feature1Ref, feature1Visible] = useScrollAnimation();
  const [feature2Ref, feature2Visible] = useScrollAnimation();
  const [feature3Ref, feature3Visible] = useScrollAnimation();

  const features = [
    {
      icon: Coins,
      title: "Real Clarity",
      description: "No confusing HR jargon.",
      gradient: "from-amber-400 to-yellow-500",
      bgGradient: "from-amber-50 to-yellow-50",
      iconBg: "bg-gradient-to-br from-amber-100 to-yellow-100",
      delay: "0ms",
    },
    {
      icon: MapPin,
      title: "India Specific",
      description: "Built for Indian salaries.",
      gradient: "from-emerald-400 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      iconBg: "bg-gradient-to-br from-emerald-100 to-teal-100",
      delay: "200ms",
    },
    {
      icon: CheckCircle2,
      title: "Instant Results",
      description: "Quick & private calculations.",
      gradient: "from-blue-400 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconBg: "bg-gradient-to-br from-blue-100 to-cyan-100",
      delay: "400ms",
    },
  ];

  return (
    <section className="py-8 md:py-10 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden relative">
      {/* Background decorative elements - minimal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-5 left-5 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-10 right-5 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container relative z-10">
        {/* Section Title - compact */}
        <div
          ref={titleRef}
          className={`text-center mb-6 md:mb-8 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Why You&apos;ll Love{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              Our Tools
            </span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-lg mx-auto">
            Experience financial clarity with tools designed specifically for you
          </p>
        </div>

        {/* Features Grid - compact */}
        <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const refs = [feature1Ref, feature2Ref, feature3Ref];
            const visibles = [feature1Visible, feature2Visible, feature3Visible];

            return (
              <div
                key={index}
                ref={refs[index]}
                className={`group transition-all duration-700 ${
                  visibles[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: feature.delay }}
              >
                <div className="relative h-full">
                  {/* Card - compact */}
                  <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col items-center text-center group-hover:-translate-y-0.5">
                    {/* Icon Container - smaller */}
                    <div
                      className={`relative ${feature.iconBg} rounded-lg p-3 w-16 h-16 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300`}
                    >
                      {/* Animated background circle */}
                      <div
                        className={`absolute inset-0 rounded-lg bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                      ></div>
                      
                      {/* Icon */}
                      <Icon
                        className={`h-8 w-8 text-transparent bg-clip-text bg-gradient-to-br ${feature.gradient} relative z-10`}
                      />
                      
                      {/* Sparkle effect for Instant Results */}
                      {index === 2 && (
                        <div className="absolute -top-0.5 -right-0.5">
                          <Sparkles className="h-3 w-3 text-yellow-400 animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Content - compact */}
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-snug">
                      {feature.description}
                    </p>

                    {/* Decorative line connecting to next feature */}
                    {index < features.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-200 to-transparent transform -translate-y-1/2">
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-1 h-1 rounded-full bg-gray-300"></div>
                      </div>
                    )}
                  </div>

                  {/* Hover glow effect */}
                  <div
                    className={`absolute inset-0 rounded-lg bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 blur-lg -z-10 transition-opacity duration-300`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom decorative line - removed to save space */}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(20px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-15px, 15px) scale(0.95);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default WhyYoullLoveOurTools;
