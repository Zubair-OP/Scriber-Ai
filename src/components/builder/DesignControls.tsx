"use client";

import {
  RESUME_COLOR_THEMES,
  RESUME_TYPOGRAPHY_THEMES,
  type ResumeColorTheme,
  type ResumeTypographyTheme,
} from "@/types/resume.types";

const SWATCH_CLASSES: Record<ResumeColorTheme, string> = {
  default: "bg-white border-2 border-dashed border-outline-variant",
  blue: "bg-blue-600 border-2 border-transparent",
  purple: "bg-purple-600 border-2 border-transparent",
  green: "bg-emerald-600 border-2 border-transparent",
  black: "bg-zinc-900 border-2 border-transparent",
  orange: "bg-orange-600 border-2 border-transparent",
  teal: "bg-teal-600 border-2 border-transparent",
};

const COLOR_LABELS: Record<ResumeColorTheme, string> = {
  default: "Template default",
  blue: "Blue",
  purple: "Purple",
  green: "Green",
  black: "Black",
  orange: "Orange",
  teal: "Teal",
};

const TYPOGRAPHY_LABELS: Record<ResumeTypographyTheme, string> = {
  modern: "Modern",
  corporate: "Corporate",
  elegant: "Elegant",
  minimal: "Minimal",
  editorial: "Editorial",
};

interface DesignControlsProps {
  colorTheme: ResumeColorTheme;
  typographyTheme: ResumeTypographyTheme;
  onColorChange: (color: ResumeColorTheme) => void;
  onTypographyChange: (typography: ResumeTypographyTheme) => void;
  className?: string;
}

export function DesignControls({
  colorTheme,
  typographyTheme,
  onColorChange,
  onTypographyChange,
  className = "",
}: DesignControlsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <div className="flex items-center gap-1.5">
        {RESUME_COLOR_THEMES.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onColorChange(color)}
            aria-label={COLOR_LABELS[color]}
            aria-pressed={colorTheme === color}
            title={COLOR_LABELS[color]}
            className={`w-5 h-5 rounded-full transition-transform ${SWATCH_CLASSES[color]} ${
              colorTheme === color ? "ring-2 ring-offset-2 ring-primary-container scale-110" : "hover:scale-110"
            }`}
          />
        ))}
      </div>
      <select
        value={typographyTheme}
        onChange={(e) => onTypographyChange(e.target.value as ResumeTypographyTheme)}
        aria-label="Typography style"
        className="px-2.5 py-1.5 border border-surface-variant rounded-lg bg-white text-xs font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30"
      >
        {RESUME_TYPOGRAPHY_THEMES.map((typo) => (
          <option key={typo} value={typo}>
            {TYPOGRAPHY_LABELS[typo]}
          </option>
        ))}
      </select>
    </div>
  );
}
