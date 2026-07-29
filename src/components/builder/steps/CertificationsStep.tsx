"use client";

import { useState } from "react";
import type { StepProps } from "@/components/builder/types";

export function CertificationsStep({ draft, updateDraft }: StepProps) {
  const [newCertification, setNewCertification] = useState("");
  const certifications = draft.certifications || [];

  const addCertification = () => {
    const value = newCertification.trim();
    if (!value) return;
    updateDraft({ certifications: [...certifications, value] });
    setNewCertification("");
  };

  const removeCertification = (index: number) => {
    updateDraft({ certifications: certifications.filter((_, i) => i !== index) });
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
        <ul className="space-y-2">
          {certifications.map((certification, index) => (
            <li
              key={`${certification}-${index}`}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-surface-variant bg-surface-subtle/40"
            >
              <span className="font-body-md text-on-surface">{certification}</span>
              <button
                type="button"
                onClick={() => removeCertification(index)}
                className="text-on-surface-variant hover:text-red-600"
                aria-label="Remove certification"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
