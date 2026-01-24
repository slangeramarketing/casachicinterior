"use client";

import { useEffect, useState } from "react";

export function useResponsiveItems(config: {
  mobile: number;
  tablet: number;
  desktop: number;
  wide?: number;
}) {
  const [items, setItems] = useState(1);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;

      if (config.wide && w >= 1536) {
        setItems(config.wide);
      } else if (w >= 1280) {
        setItems(config.desktop);
      } else if (w >= 768) {
        setItems(config.tablet);
      } else {
        setItems(config.mobile);
      }
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [config]);

  return items;
}
