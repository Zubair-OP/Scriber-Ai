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
}

export function TextAreaField({ label, value, onChange, placeholder, rows = 4 }: TextAreaFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-on-surface mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 border border-surface-variant rounded-xl bg-surface-subtle placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container focus:bg-white transition-all text-sm resize-y"
      />
    </div>
  );
}

export function EntryCard({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="relative p-5 rounded-2xl border border-surface-variant bg-surface-subtle/40 space-y-4">
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
