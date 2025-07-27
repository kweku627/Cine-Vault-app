import React from "react";
import "../styles.css"; // Make sure to import your CSS file

// Generic skeleton block
export function Skeleton({ width = "100%", height = "16px", style = {}, className = "", ...props }) {
  return (
    <div
      className={`skeleton shimmer ${className}`}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}

// Multi-line text skeleton
export function SkeletonText({ lines = 3, width = "100%", style = {}, className = "" }) {
  return (
    <div style={{ ...style }} className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 && lines > 1 ? "75%" : width}
          height="16px"
          style={{ marginBottom: i !== lines - 1 ? 8 : 0 }}
        />
      ))}
    </div>
  );
}

// Avatar skeleton
export function SkeletonAvatar({ size = 40, style = {}, className = "" }) {
  return (
    <div
      className={`skeleton shimmer ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        ...style
      }}
    />
  );
} 