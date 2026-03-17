"use client";

interface ChoiceButtonProps {
  emoji: string;
  title: string;
  subtitle: string;
  selected: boolean;
  onClick: () => void;
}

export default function ChoiceButton({
  emoji,
  title,
  subtitle,
  selected,
  onClick,
}: ChoiceButtonProps) {
  return (
    <div
      onClick={onClick}
      className={`
        group flex items-center gap-4 px-5 py-4 bg-bg-card rounded-xl transition-all duration-200 cursor-pointer hover:scale-[1.01] active:scale-[0.97]
        ${
          selected
            ? "border-2 border-purina-red bg-hover-red-bg shadow-md shadow-purina-red/5"
            : "border border-border-dark hover:border-purina-red/60 hover:shadow-sm hover:shadow-black/5"
        }
      `}
    >
      {/* Emoji circle */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
        selected ? "bg-purina-red/10" : "bg-bg-card-hover group-hover:bg-bg-card-hover/80"
      }`}>
        <span className="text-3xl">{emoji}</span>
      </div>

      {/* Text area */}
      <div className="flex-1">
        <p
          className={`font-bold text-base transition-colors duration-200 ${
            selected ? "text-purina-red" : "text-text-title group-hover:text-purina-red"
          }`}
        >
          {title}
        </p>
        <p className="text-sm text-text-muted">{subtitle}</p>
      </div>

      {/* Checkmark */}
      {selected && (
        <div className="w-6 h-6 rounded-full bg-purina-red flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">&#x2714;</span>
        </div>
      )}
    </div>
  );
}
