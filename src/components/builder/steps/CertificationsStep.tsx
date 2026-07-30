"use client";

import { useMemo, useState } from "react";
import { SortableList } from "@/components/builder/SortableList";
import type { StepProps } from "@/components/builder/types";

interface CertificationEntry {
  value: string;
  _dndId: string;
}

export function CertificationsStep({ draft, updateDraft }: StepProps) {
  const [newCertification, setNewCertification] = useState("");
  // Derived (not backfilled) — see SkillsStep for why a per-render `.map` into
  // fresh {value} objects can't use the ephemeral-id-backfill pattern.
  const certifications: CertificationEntry[] = useMemo(
    () => (draft.certifications || []).map((value, index) => ({ value, _dndId: `${index}-${value}` })),
    [draft.certifications]
  );

  const addCertification = () => {
    const value = newCertification.trim();
    if (!value) return;
    updateDraft({ certifications: [...certifications.map((c) => c.value), value] });
    setNewCertification("");
  };

  const removeCertification = (id: string) => {
    updateDraft({ certifications: certifications.filter((c) => c._dndId !== id).map((c) => c.value) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline-md text-on-surface mb-1">Certifications</h2>
        <p className="font-body-md text-on-surface-variant">
          Optional — add any certifications worth highlighting.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          value={newCertification}
          onChange={(e) => setNewCertification(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCertification();
            }
          }}
          placeholder="e.g. AWS Certified Solutions Architect"
          className="flex-1 px-4 py-3 border border-surface-variant rounded-xl bg-surface-subtle placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container focus:bg-white transition-all text-sm"
        />
        <button
          type="button"
          onClick={addCertification}
          className="px-5 py-3 bg-primary-container text-white font-label-lg rounded-xl hover:bg-primary transition-colors"
        >
          Add
        </button>
      </div>

      {certifications.length === 0 ? (
        <p className="font-body-md text-on-surface-variant">No certifications added yet.</p>
      ) : (
        <SortableList
          items={certifications}
          onReorder={(next) => updateDraft({ certifications: next.map((c) => c.value) })}
          className="space-y-2"
          renderItem={(certification, _index, drag) => (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-surface-variant bg-surface-subtle/40">
              <button
                type="button"
                {...drag.attributes}
                {...drag.listeners}
                className="text-on-surface-variant/50 hover:text-on-surface-variant cursor-grab active:cursor-grabbing touch-none"
                aria-label="Drag to reorder"
              >
                <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
              </button>
              <span className="flex-1 font-body-md text-on-surface">{certification.value}</span>
              <button
                type="button"
                onClick={() => removeCertification(certification._dndId)}
                className="text-on-surface-variant hover:text-red-600"
                aria-label="Remove certification"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          )}
        />
      )}
    </div>
  );
}
