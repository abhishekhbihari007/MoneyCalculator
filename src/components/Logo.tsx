export default function Logo({ className }: { className?: string }) {
  return (
    <svg 
      width="48" 
      height="48" 
      viewBox="0 0 48 48" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className || "h-12 w-12"}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
      </defs>

      {/* Icon - Circular Badge with Rupee */}
      {/* Outer Circle */}
      <circle 
        cx="24" 
        cy="24" 
        r="22" 
        fill="url(#logoGradient)" 
        opacity="0.1"
      />
      <circle 
        cx="24" 
        cy="24" 
        r="22" 
        fill="none" 
        stroke="url(#logoGradient)" 
        strokeWidth="3"
      />
      
      {/* Inner Circle for Rupee */}
      <circle 
        cx="24" 
        cy="24" 
        r="15" 
        fill="url(#logoGradient)" 
        opacity="0.15"
      />

      {/* Rupee Symbol - Perfectly Centered */}
      <text 
        x="24" 
        y="28" 
        fontSize="22" 
        fontWeight="900"
        fill="url(#logoGradient)"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        ₹
      </text>
      
      {/* Small Growth Indicator - Top Right */}
      <circle 
        cx="36" 
        cy="8" 
        r="4" 
        fill="#10B981"
      />
      <path 
        d="M 34 8 L 36 6 L 38 8" 
        stroke="white" 
        strokeWidth="1" 
        strokeLinecap="round" 
        fill="none"
      />
    </svg>
  );
}


