"use client";

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export function TextField({ label, value, onChange, placeholder, type = "text", required }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-on-surface mb-1.5">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-surface-variant rounded-xl bg-surface-subtle placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container focus:bg-white transition-all text-sm"
      />
    </div>
  );
}

interface TextAreaFieldProps extends FieldProps {
  rows?: number;
  maxWords?: number;
}

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function truncateToWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ");
}

export function TextAreaField({ label, value, onChange, placeholder, rows = 4, maxWords }: TextAreaFieldProps) {
  const wordCount = countWords(value);
  const overLimit = maxWords ? wordCount > maxWords : false;

  const handleChange = (next: string) => {
    if (maxWords && countWords(next) > maxWords) {
      onChange(truncateToWords(next, maxWords));
      return;
    }
    onChange(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-on-surface">
          {label}
        </label>
        {maxWords && (
          <span className={`text-xs ${overLimit ? "text-red-600" : "text-on-surface-variant"}`}>
            {wordCount}/{maxWords} words
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 border border-surface-variant rounded-xl bg-surface-subtle placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container focus:bg-white transition-all text-sm resize-y"
      />
    </div>
  );
}

interface MonthFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function MonthField({ label, value, onChange, disabled }: MonthFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-on-surface mb-1.5">{label}</label>
      <input
        type="month"
        value={disabled ? "" : value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-surface-variant rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container focus:bg-white transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

interface DateRangeFieldsProps {
  startLabel?: string;
  endLabel?: string;
  startValue: string;
  endValue: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  presentLabel?: string;
}

export function DateRangeFields({
  startLabel = "Start date",
  endLabel = "End date",
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  presentLabel = "This is ongoing",
}: DateRangeFieldsProps) {
  const isPresent = endValue === "Present";

  return (
    <>
      <MonthField label={startLabel} value={startValue} onChange={onStartChange} />
      <div>
        <MonthField label={endLabel} value={endValue} onChange={onEndChange} disabled={isPresent} />
        <label className="mt-2 flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer">
          <input
            type="checkbox"
            checked={isPresent}
            onChange={(e) => onEndChange(e.target.checked ? "Present" : "")}
            className="h-4 w-4 rounded border-outline-variant text-primary-container focus:ring-primary-container"
          />
          {presentLabel}
        </label>
      </div>
    </>
  );
}

export function EntryCard({
  children,
  onRemove,
  dragHandleProps,
}: {
  children: React.ReactNode;
  onRemove: () => void;
  dragHandleProps?: { attributes?: object; listeners?: object };
}) {
  return (
    <div className="relative p-5 rounded-2xl border border-surface-variant bg-surface-subtle/40 space-y-4">
      {dragHandleProps && (
        <button
          type="button"
          {...dragHandleProps.attributes}
          {...dragHandleProps.listeners}
          className="absolute top-4 left-4 text-on-surface-variant/50 hover:text-on-surface-variant cursor-grab active:cursor-grabbing transition-colors touch-none"
          aria-label="Drag to reorder"
        >
          <span className="material-symbols-outlined text-[20px]">drag_indicator</span>
        </button>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-4 right-4 text-on-surface-variant hover:text-red-600 transition-colors"
        aria-label="Remove entry"
      >
        <span className="material-symbols-outlined text-[20px]">close</span>
      </button>
      {children}
    </div>
  );
}

export function AddEntryButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-primary-container font-label-lg border border-dashed border-primary-container/40 rounded-xl px-4 py-2.5 hover:bg-primary/5 transition-colors"
    >
      <span className="material-symbols-outlined text-[18px]">add</span>
      {label}
    </button>
  );
}
