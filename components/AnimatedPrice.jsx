"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

export default function AnimatedPrice({ value }) {
  const priceRef = useRef(null);
  const isInView = useInView(priceRef, {
    once: true,
    amount: 0.4,
  });

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const end = Number(value) || 0;
    const duration = 900;
    const startTime = performance.now();

    function animatePrice(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(Math.floor(end * eased));

      if (progress < 1) {
        requestAnimationFrame(animatePrice);
      }
    }

    requestAnimationFrame(animatePrice);
  }, [isInView, value]);

  return (
    <span ref={priceRef}>
      ${displayValue.toLocaleString()}
    </span>
  );
}