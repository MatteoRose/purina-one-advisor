"use client";

interface FlagIconProps {
  country: "gb" | "it";
  size?: number;
}

export default function FlagIcon({ country, size = 20 }: FlagIconProps) {
  if (country === "gb") {
    return (
      <svg width={size} height={size * 0.6} viewBox="0 0 60 36" className="rounded-sm flex-shrink-0">
        {/* Blue background */}
        <rect width="60" height="36" fill="#012169" />
        {/* White diagonal stripes */}
        <path d="M0,0 L60,36 M60,0 L0,36" stroke="#FFFFFF" strokeWidth="6" />
        {/* Red diagonal stripes */}
        <path d="M0,0 L60,36 M60,0 L0,36" stroke="#C8102E" strokeWidth="2" />
        {/* White cross */}
        <path d="M30,0 V36 M0,18 H60" stroke="#FFFFFF" strokeWidth="10" />
        {/* Red cross */}
        <path d="M30,0 V36 M0,18 H60" stroke="#C8102E" strokeWidth="6" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 60 36" className="rounded-sm flex-shrink-0">
      {/* Green */}
      <rect x="0" y="0" width="20" height="36" fill="#009246" />
      {/* White */}
      <rect x="20" y="0" width="20" height="36" fill="#FFFFFF" />
      {/* Red */}
      <rect x="40" y="0" width="20" height="36" fill="#CE2B37" />
    </svg>
  );
}
