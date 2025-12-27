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
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container relative z-10">
        {/* Section Title */}
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why You&apos;ll Love{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              Our Tools
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience financial clarity with tools designed specifically for you
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
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
                  {/* Card */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col items-center text-center group-hover:-translate-y-2">
                    {/* Icon Container */}
                    <div
                      className={`relative mb-6 ${feature.iconBg} rounded-2xl p-6 w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      {/* Animated background circle */}
                      <div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                      ></div>
                      
                      {/* Icon */}
                      <Icon
                        className={`h-12 w-12 text-transparent bg-clip-text bg-gradient-to-br ${feature.gradient} relative z-10`}
                      />
                      
                      {/* Sparkle effect for Instant Results */}
                      {index === 2 && (
                        <div className="absolute -top-1 -right-1">
                          <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Decorative line connecting to next feature */}
                    {index < features.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-gray-200 to-transparent transform -translate-y-1/2">
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-gray-300"></div>
                      </div>
                    )}
                  </div>

                  {/* Hover glow effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur-xl -z-10 transition-opacity duration-300`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom decorative line */}
        <div className="mt-16 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent rounded-full"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
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

