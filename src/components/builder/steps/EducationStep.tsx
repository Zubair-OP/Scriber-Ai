"use client";

import { AddEntryButton, EntryCard, TextField } from "@/components/builder/fields";
import type { StepProps } from "@/components/builder/types";
import type { IEducation } from "@/types/resume.types";

const emptyEntry: IEducation = { institute: "", degree: "", startDate: "", endDate: "" };

export function EducationStep({ draft, updateDraft }: StepProps) {
  const entries = draft.education || [];

  const updateEntry = (index: number, patch: Partial<IEducation>) => {
    const next = entries.map((entry, i) => (i === index ? { ...entry, ...patch } : entry));
    updateDraft({ education: next });
  };

  const addEntry = () => updateDraft({ education: [...entries, { ...emptyEntry }] });
  const removeEntry = (index: number) => updateDraft({ education: entries.filter((_, i) => i !== index) });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline-md text-on-surface mb-1">Education</h2>
        <p className="font-body-md text-on-surface-variant">
          Add your degrees, most recent first.
        </p>
      </div>

      <div className="space-y-5">
        {entries.map((entry, index) => (
          <EntryCard key={index} onRemove={() => removeEntry(index)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Institute"
                value={entry.institute}
                onChange={(value) => updateEntry(index, { institute: value })}
                placeholder="Princeton University"
              />
              <TextField
                label="Degree"
                value={entry.degree}
                onChange={(value) => updateEntry(index, { degree: value })}
                placeholder="B.S. Computer Science"
              />
              <TextField
                label="Start date"
                value={entry.startDate}
                onChange={(value) => updateEntry(index, { startDate: value })}
                placeholder="Sep 2018"
              />
              <TextField
                label="End date"
                value={entry.endDate}
                onChange={(value) => updateEntry(index, { endDate: value })}
                placeholder="Jun 2022"
              />
            </div>
          </EntryCard>
        ))}
      </div>

      <AddEntryButton label="Add education" onClick={addEntry} />
    </div>
  );
}
