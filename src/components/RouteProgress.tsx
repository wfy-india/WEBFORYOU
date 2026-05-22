"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

export function RouteProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);
  const progressRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // when pathname changes, show the progress bar briefly
    if (!pathname) return;
    setVisible(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    // simulate progress: hide after 700ms (tune as needed)
    timeoutRef.current = window.setTimeout(() => {
      setVisible(false);
      timeoutRef.current = null;
    }, 700);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        height: 3,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <div
        ref={progressRef}
        className={
          `transition-all duration-700 ease-out origin-left ${visible ? "scale-x-100" : "scale-x-0"}`
        }
        style={{
          transformOrigin: "left",
          background: "linear-gradient(90deg,#2563eb,#7c3aed)",
          height: "100%",
        }}
      />
    </div>
  );
}
