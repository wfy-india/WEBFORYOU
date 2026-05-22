"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function ContentProtection() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.error("Right click is disabled to protect our content", {
        position: "bottom-right",
        style: {
          backgroundColor: "#ef4444",
          color: "white",
          border: "none"
        }
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "u") ||
        (e.metaKey && e.altKey && (e.key === "i" || e.key === "j")) // Mac shortcuts
      ) {
        e.preventDefault();
        toast.error("Inspector is disabled to protect our content", {
          position: "bottom-right",
          style: {
            backgroundColor: "#ef4444",
            color: "white",
            border: "none"
          }
        });
      }
    };

    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === "IMG") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    // Also disable global image dragging via CSS or additional events
    const style = document.createElement("style");
    style.innerHTML = `
      img {
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
      document.head.removeChild(style);
    };
  }, []);

  return null;
}
