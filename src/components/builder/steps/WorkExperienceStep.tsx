"use client";

import { useState } from "react";
import { generateExperienceApi, improveContentApi } from "@/apis/ai.api";
import { AIActionButton } from "@/components/builder/AIActionButton";
import { AddEntryButton, DateRangeFields, EntryCard, TextAreaField, TextField } from "@/components/builder/fields";
import { SortableList } from "@/components/builder/SortableList";
import { useEntryIds } from "@/components/builder/useEntryIds";
import type { StepProps } from "@/components/builder/types";
import type { IWorkExperience } from "@/types/resume.types";

type Entry = IWorkExperience & { _dndId?: string };

const emptyEntry: IWorkExperience = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  description: "",
};

interface AiContext {
  experienceLevel: string;
  techStack: string;
  yearsOfExperience: string;
}

const emptyContext: AiContext = { experienceLevel: "Mid-Level", techStack: "", yearsOfExperience: "2" };

export function WorkExperienceStep({ draft, updateDraft }: StepProps) {
  const rawEntries = (draft.workExperience || []) as Entry[];
  const entries = useEntryIds(rawEntries, (next) => updateDraft({ workExperience: next }));
  const [contexts, setContexts] = useState<Record<string, AiContext>>({});

  const getContext = (id: string) => contexts[id] || emptyContext;
  const setContext = (id: string, patch: Partial<AiContext>) => {
    setContexts((prev) => ({ ...prev, [id]: { ...getContext(id), ...patch } }));
  };

  const updateEntry = (id: string, patch: Partial<IWorkExperience>) => {
    const next = entries.map((entry) => (entry._dndId === id ? { ...entry, ...patch } : entry));
    updateDraft({ workExperience: next });
  };

  const addEntry = () => updateDraft({ workExperience: [...entries, { ...emptyEntry }] });
  const removeEntry = (id: string) =>
    updateDraft({ workExperience: entries.filter((entry) => entry._dndId !== id) });

  const generateDescription = async (id: string) => {
    const entry = entries.find((e) => e._dndId === id);
    if (!entry) return;
    const context = getContext(id);
    const response = await generateExperienceApi({
      jobRole: entry.position || "Professional",
      experienceLevel: context.experienceLevel,
      techStack: context.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      yearsOfExperience: Number(context.yearsOfExperience) || 0,
    });
    updateEntry(id, { description: response?.data?.workExperienceDescription || entry.description });
  };

  const improveDescription = async (id: string) => {
    const entry = entries.find((e) => e._dndId === id);
    if (!entry?.description) return;
    const response = await improveContentApi({ content: entry.description });
    updateEntry(id, { description: response?.data?.improvedContent || entry.description });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline-md text-on-surface mb-1">Work Experience</h2>
        <p className="font-body-md text-on-surface-variant">
          Add your roles, most recent first.
        </p>
      </div>

      <SortableList
        items={entries}
        onReorder={(next) => updateDraft({ workExperience: next })}
        className="space-y-5"
        renderItem={(entry, _index, drag) => (
          <EntryCard onRemove={() => removeEntry(entry._dndId)} dragHandleProps={drag}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Company"
                value={entry.company}
                onChange={(value) => updateEntry(entry._dndId, { company: value })}
                placeholder="Acme Inc."
              />
              <TextField
                label="Position"
                value={entry.position}
                onChange={(value) => updateEntry(entry._dndId, { position: value })}
                placeholder="Senior Engineer"
              />
              <DateRangeFields
                startValue={entry.startDate}
                endValue={entry.endDate}
                onStartChange={(value) => updateEntry(entry._dndId, { startDate: value })}
                onEndChange={(value) => updateEntry(entry._dndId, { endDate: value })}
                presentLabel="I currently work here"
              />
            </div>

            <div className="p-4 rounded-xl bg-white border border-surface-variant space-y-3">
              <p className="font-label-sm text-on-surface-variant uppercase tracking-wide">
                AI context (used only to generate a draft — not saved)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Experience level</label>
                  <select
                    value={getContext(entry._dndId).experienceLevel}
                    onChange={(e) => setContext(entry._dndId, { experienceLevel: e.target.value })}
                    className="w-full px-3 py-2.5 border border-surface-variant rounded-xl bg-surface-subtle text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/30"
                  >
                    {["Fresher", "Junior", "Mid-Level", "Senior"].map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <TextField
                  label="Tech stack (comma separated)"
                  value={getContext(entry._dndId).techStack}
                  onChange={(value) => setContext(entry._dndId, { techStack: value })}
                  placeholder="React, Node.js"
                />
                <TextField
                  label="Years of experience"
                  type="number"
                  value={getContext(entry._dndId).yearsOfExperience}
                  onChange={(value) => setContext(entry._dndId, { yearsOfExperience: value })}
                  placeholder="2"
                />
              </div>
              <AIActionButton label="Generate description with AI" onRun={() => generateDescription(entry._dndId)} />
            </div>

            <div className="space-y-2">
              <TextAreaField
                label="Description"
                value={entry.description}
                onChange={(value) => updateEntry(entry._dndId, { description: value })}
                placeholder="Describe your responsibilities and impact..."
                maxWords={150}
              />
              <AIActionButton label="Improve with AI" onRun={() => improveDescription(entry._dndId)} />
            </div>
          </EntryCard>
        )}
      />

      <AddEntryButton label="Add work experience" onClick={addEntry} />
    </div>
  );
}
