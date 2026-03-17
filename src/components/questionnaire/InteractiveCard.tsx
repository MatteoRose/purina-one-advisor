"use client";
import Image from "next/image";

interface InteractiveCardProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  selected: boolean;
  onClick: () => void;
}

export default function InteractiveCard({
  imageSrc,
  title,
  subtitle,
  selected,
  onClick,
}: InteractiveCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        group relative bg-bg-card rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden active:scale-[0.97] hover:scale-[1.02]
        flex flex-row sm:flex-col items-center sm:items-stretch
        ${
          selected
            ? "border-[3px] border-purina-red shadow-lg shadow-purina-red/10"
            : "border-2 border-border-dark hover:border-purina-red/60 hover:shadow-md hover:shadow-black/10"
        }
      `}
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
        <div className="w-[80px] h-[80px] sm:w-[130px] sm:h-[130px] rounded-xl flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={title}
            width={120}
            height={120}
            className="object-contain drop-shadow-md"
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
