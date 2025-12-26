"use client";

import { MapPin, Users, TrendingUp, Calendar, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const stats = [
  {
    icon: Users,
    value: "1.2 cr",
    label: "Registered users from 1300+ cities",
    color: "text-green-600",
  },
  {
    icon: TrendingUp,
    value: "₹25,000 cr",
    label: "Money under management",
    color: "text-green-600",
  },
  {
    icon: Calendar,
    value: "50 lakh +",
    label: "Monthly SIPs registered",
    color: "text-green-600",
  },
  {
    icon: Clock,
    value: "1.5 sec",
    label: "Average time gap between new SIPs",
    color: "text-green-600",
  },
];

const testimonials = [
  {
    quote: "I paid the downpayment of my dream home with the returns I got from my SIP.",
    name: "Rahul Diwan",
    location: "Manali",
  },
  {
    quote: "The calculators helped me understand my actual take-home salary better.",
    name: "Priya Sharma",
    location: "Mumbai",
  },
  {
    quote: "Retirement planning became so much clearer with these tools.",
    name: "Amit Kumar",
    location: "Delhi",
  },
];

const StatsSection = () => {
  const [leftRef, leftVisible] = useScrollAnimation();
  const [rightRef, rightVisible] = useScrollAnimation();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50 overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Map with Testimonials */}
          <div 
            ref={leftRef}
            className={`relative transition-all duration-700 ${leftVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            {/* India Map Background */}
            <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 h-[500px] overflow-hidden">
              {/* Map Pattern */}
              <div className="absolute inset-0 opacity-20">
                <svg viewBox="0 0 400 500" className="w-full h-full">
                  {/* Simplified India Map Outline */}
                  <path
                    d="M 200 50 L 250 80 L 280 120 L 300 180 L 320 250 L 310 320 L 280 380 L 250 420 L 200 450 L 150 420 L 120 380 L 90 320 L 80 250 L 100 180 L 120 120 L 150 80 Z"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  {/* Dots representing cities */}
                  {[
                    { x: 200, y: 150 },
                    { x: 180, y: 200 },
                    { x: 220, y: 180 },
                    { x: 190, y: 250 },
                    { x: 210, y: 300 },
                    { x: 170, y: 320 },
                    { x: 230, y: 280 },
                  ].map((dot, i) => (
                    <circle
                      key={i}
                      cx={dot.x}
                      cy={dot.y}
                      r="4"
                      fill="#10B981"
                      className="animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </svg>
              </div>

              {/* Testimonial Cards */}
              <div className="relative z-10 space-y-4">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs ml-auto transition-all duration-500 hover:shadow-xl hover:scale-105 ${leftVisible ? 'animate-slide-in-right' : 'opacity-0'}`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <p className="text-sm text-gray-700 mb-2 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-semibold text-gray-900">{testimonial.name}</span>
                      <span className="text-xs text-gray-500">• {testimonial.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Stats and Content */}
          <div 
            ref={rightRef}
            className={`space-y-8 transition-all duration-700 ${rightVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-up">
                We are loved by people from all parts of India
              </h2>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      {i < 4 ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Rating on Play Store & App Store</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-2 ${rightVisible ? 'animate-bounce-in' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className={`${stat.color} mb-3`}>
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

