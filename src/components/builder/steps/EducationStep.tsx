"use client";

import { AddEntryButton, DateRangeFields, EntryCard, TextField } from "@/components/builder/fields";
import { SortableList } from "@/components/builder/SortableList";
import { useEntryIds } from "@/components/builder/useEntryIds";
import type { StepProps } from "@/components/builder/types";
import type { IEducation } from "@/types/resume.types";

type Entry = IEducation & { _dndId?: string };

const emptyEntry: IEducation = { institute: "", degree: "", startDate: "", endDate: "" };

export function EducationStep({ draft, updateDraft }: StepProps) {
  const rawEntries = (draft.education || []) as Entry[];
  const entries = useEntryIds(rawEntries, (next) => updateDraft({ education: next }));

  const updateEntry = (id: string, patch: Partial<IEducation>) => {
    const next = entries.map((entry) => (entry._dndId === id ? { ...entry, ...patch } : entry));
    updateDraft({ education: next });
  };

  const addEntry = () => updateDraft({ education: [...entries, { ...emptyEntry }] });
  const removeEntry = (id: string) => updateDraft({ education: entries.filter((entry) => entry._dndId !== id) });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline-md text-on-surface mb-1">Education</h2>
        <p className="font-body-md text-on-surface-variant">
          Add your degrees, most recent first.
        </p>
      </div>

      <SortableList
        items={entries}
        onReorder={(next) => updateDraft({ education: next })}
        className="space-y-5"
        renderItem={(entry, _index, drag) => (
          <EntryCard onRemove={() => removeEntry(entry._dndId)} dragHandleProps={drag}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Institute"
                value={entry.institute}
                onChange={(value) => updateEntry(entry._dndId, { institute: value })}
                placeholder="Princeton University"
              />
              <TextField
                label="Degree"
                value={entry.degree}
                onChange={(value) => updateEntry(entry._dndId, { degree: value })}
                placeholder="B.S. Computer Science"
              />
              <DateRangeFields
                startValue={entry.startDate}
                endValue={entry.endDate}
                onStartChange={(value) => updateEntry(entry._dndId, { startDate: value })}
                onEndChange={(value) => updateEntry(entry._dndId, { endDate: value })}
                presentLabel="I'm currently studying here"
              />
            </div>
          </EntryCard>
        )}
      />

      <AddEntryButton label="Add education" onClick={addEntry} />
    </div>
  );
}
