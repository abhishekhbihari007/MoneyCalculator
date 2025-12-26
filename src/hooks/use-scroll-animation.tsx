"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollAnimation(options = { threshold: 0.1, rootMargin: "0px" }) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const currentRef = ref.current;
    if (!currentRef) return;

    // Check initial visibility using requestAnimationFrame for better timing
    const checkInitialVisibility = () => {
      if (currentRef) {
        const rect = currentRef.getBoundingClientRect();
        const isInViewport = 
          rect.top < window.innerHeight &&
          rect.bottom > 0 &&
          rect.left < window.innerWidth &&
          rect.right > 0;
        
        if (isInViewport) {
          // Use requestAnimationFrame to ensure DOM is fully rendered
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        }
      }
    };

    // Check after a short delay to ensure layout is complete
    const timeoutId = setTimeout(checkInitialVisibility, 150);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      options
    );

    observer.observe(currentRef);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Return mounted state to prevent hydration issues
  return [ref, mounted ? isVisible : false] as const;
}

