import React, { useEffect, useState } from 'react';

export default function RedactedText({ children }) {
  const [displayText, setDisplayText] = useState(children);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const otherChars = "0123456789!@#$%^&*()";
    const originalText = children;
    let glitchInterval;
    let initialTimer;
    let isAnimating = false;

    const startGlitch = () => {
      if (isAnimating) return;
      isAnimating = true;
      setIsGlitching(true);
      let iterations = 0;
      
      glitchInterval = setInterval(() => {
        setDisplayText(
          originalText
            .split("")
            .map((char, index) => {
              if (index < iterations) return originalText[index];
              
              if (/[a-z]/.test(char)) {
                return lowerChars[Math.floor(Math.random() * lowerChars.length)];
              } else if (/[A-Z]/.test(char)) {
                return upperChars[Math.floor(Math.random() * upperChars.length)];
              } else {
                return otherChars[Math.floor(Math.random() * otherChars.length)];
              }
            })
            .join("")
        );
        iterations += 1 / 3;
        if (iterations >= originalText.length) {
          clearInterval(glitchInterval);
          isAnimating = false;
          setIsGlitching(false);
          setDisplayText(originalText);
        }
      }, 50);
    };

    initialTimer = setTimeout(startGlitch, 800);
    const timer = setInterval(startGlitch, 4000);

    return () => {
      clearInterval(timer);
      clearTimeout(initialTimer);
      clearInterval(glitchInterval);
    };
  }, [children]);

  return (
    <span className={`font-serif-luxury italic transition-all duration-200 ${isGlitching ? 'text-cyan-400 animate-pulse' : 'text-slate-100'}`}>
      {displayText}
    </span>
  );
}
