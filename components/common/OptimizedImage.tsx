import { StaticImageData } from "next/image";
import React from "react";
import defualtImage from "@/public/assets/default.jpg";

type OptimizedImageProps = {
  src?: string | StaticImageData;
  alt?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  className?: string;
};

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  fetchPriority,
  className,
}: OptimizedImageProps) {
  const resolvedSrc =
    src
      ? typeof src === "string"
        ? src
        : src.src
      : defualtImage.src;

  return (
    <img
      src={resolvedSrc}
      alt={alt || ""}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={fetchPriority || (priority ? "high" : "auto")}
      decoding="async"
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      sizes={sizes}
      className={className}
      style={
        fill
          ? {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }
          : width && height
            ? { aspectRatio: `${width} / ${height}` }
            : undefined
      }
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement;
        if (img.dataset.fallbackApplied) return;
        img.dataset.fallbackApplied = "true";
        img.src = defualtImage.src;
      }}
    />
  );
}
