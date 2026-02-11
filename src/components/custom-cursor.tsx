"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    const handleMouseEnter = () => cursor.classList.add("hovered");
    const handleMouseLeave = () => cursor.classList.remove("hovered");

    document.addEventListener("mousemove", handleMouseMove);

    // Add hover effect to all interactive elements
    const addHoverListeners = () => {
      const interactables = document.querySelectorAll("button, a, [role='button']");
      interactables.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });

      return () => {
        interactables.forEach((el) => {
          el.removeEventListener("mouseenter", handleMouseEnter);
          el.removeEventListener("mouseleave", handleMouseLeave);
        });
      };
    };

    const cleanupHover = addHoverListeners();

    // Re-add listeners on DOM changes (for dynamic elements)
    const observer = new MutationObserver(() => {
      cleanupHover();
      addHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cleanupHover();
      observer.disconnect();
    };
  }, []);

  return <div ref={cursorRef} className='cursor-dot' />;
}
