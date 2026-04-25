"use client";
import Image from "next/image";

interface InteractiveCardProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  selected: boolean;
  onClick: () => void;
  /** "contain" (default) = product cutouts; "cover-circle" = portrait photo in circle */
  imageFit?: "contain" | "cover-circle";
}

export default function InteractiveCard({
  imageSrc,
  title,
  subtitle,
  selected,
  onClick,
  imageFit = "contain",
}: InteractiveCardProps) {
  const isPortrait = imageFit === "cover-circle";
  return (
    <div
      onClick={onClick}
      className={`
        group relative bg-bg-card rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden active:scale-[0.97] hover:scale-[1.02]
        flex flex-row sm:flex-col items-center sm:items-stretch
        ${
          selected
            ? "border-[3px] border-purina-red shadow-xl shadow-purina-red/15"
            : "border-2 border-border-dark shadow-lg shadow-black/20 hover:border-purina-red/60 hover:shadow-xl hover:shadow-black/15"
        }
      `}
      style={{
        boxShadow: selected
          ? "inset 0 1px 2px rgba(233,28,36,0.08), var(--tw-shadow)"
          : "inset 0 1px 2px rgba(255,255,255,0.04), var(--tw-shadow)",
      }}
    >
      {/* Selected checkmark badge */}
      {selected && (
        <div className="absolute top-3 right-3 bg-purina-red rounded-full w-7 h-7 flex items-center justify-center text-white text-sm font-bold shadow-md z-10">
          &#x2714;
        </div>
      )}

      {/* Image */}
      <div className={`flex justify-center p-4 sm:p-6 transition-colors duration-200 ${
        selected ? "bg-hover-red-bg/30" : "group-hover:bg-bg-card-hover/30"
      }`}>
        <div
          className={`w-[80px] h-[80px] sm:w-[130px] sm:h-[130px] flex items-center justify-center overflow-hidden ${
            isPortrait
              ? "rounded-full ring-2 ring-border-dark/60 shadow-lg bg-bg-card-hover/40"
              : "rounded-xl"
          }`}
        >
          <Image
            src={imageSrc}
            alt={title}
            width={isPortrait ? 260 : 120}
            height={isPortrait ? 260 : 120}
            className={
              isPortrait
                ? "w-full h-full object-cover"
                : "object-contain drop-shadow-md"
            }
          />
        </div>
      </div>

      {/* Text content */}
      <div className={`px-4 pb-4 sm:pb-5 pt-1 flex-1 sm:flex-none transition-colors duration-200 ${
        selected ? "bg-hover-red-bg/20" : ""
      }`}>
        <p
          className={`text-base sm:text-lg font-bold uppercase text-left sm:text-center transition-colors duration-200 ${
            selected
              ? "text-purina-red"
              : "text-text-title group-hover:text-purina-red"
          }`}
        >
          {title}
        </p>
        <p className="text-sm text-text-muted text-left sm:text-center mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
