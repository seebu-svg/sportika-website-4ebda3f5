"use client";

import Image from "next/image";
import { useState } from "react";

function Artwork() {
  const id = Math.random().toString(36).slice(2, 8);
  return (
    <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1E5FD9" />
          <stop offset="1" stopColor="#07152B" />
        </linearGradient>
      </defs>
      <rect width="1200" height="600" fill={`url(#${id})`} />
      <circle cx="600" cy="290" r="170" stroke="#fff" strokeOpacity=".3" strokeWidth="3" fill="none" />
    </svg>
  );
}

interface PhotoProps {
  src?: string | null;
  alt?: string;
  className?: string;
  eager?: boolean;
}

// A photo that sits in `.ph`; shows the gradient artwork placeholder if the
// source is missing or fails to load (matches the prototype's fallback).
export function Photo({ src, alt = "", className, eager }: PhotoProps) {
  const [failed, setFailed] = useState(false);
  const showImg = src && !failed;
  return (
    <div className={className ? `ph ${className}` : "ph"}>
      {showImg ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          loading={eager ? "eager" : "lazy"}
          onError={() => setFailed(true)}
        />
      ) : (
        <Artwork />
      )}
    </div>
  );
}
