"use client";

import { useState } from "react";
import { generateExperienceApi, improveContentApi } from "@/apis/ai.api";
import { AIActionButton } from "@/components/builder/AIActionButton";
import { AddEntryButton, EntryCard, TextAreaField, TextField } from "@/components/builder/fields";
import type { StepProps } from "@/components/builder/types";
import type { IWorkExperience } from "@/types/resume.types";

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
  const entries = draft.workExperience || [];
  const [contexts, setContexts] = useState<Record<number, AiContext>>({});

  const getContext = (index: number) => contexts[index] || emptyContext;
  const setContext = (index: number, patch: Partial<AiContext>) => {
    setContexts((prev) => ({ ...prev, [index]: { ...getContext(index), ...patch } }));
  };

  const updateEntry = (index: number, patch: Partial<IWorkExperience>) => {
    const next = entries.map((entry, i) => (i === index ? { ...entry, ...patch } : entry));
    updateDraft({ workExperience: next });
  };

  const addEntry = () => updateDraft({ workExperience: [...entries, { ...emptyEntry }] });
  const removeEntry = (index: number) =>
    updateDraft({ workExperience: entries.filter((_, i) => i !== index) });

  const generateDescription = async (index: number) => {
    const entry = entries[index];
    const context = getContext(index);
    const response = await generateExperienceApi({
      jobRole: entry.position || "Professional",
      experienceLevel: context.experienceLevel,
      techStack: context.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      yearsOfExperience: Number(context.yearsOfExperience) || 0,
    });
    updateEntry(index, { description: response?.data?.workExperienceDescription || entry.description });
  };

  const improveDescription = async (index: number) => {
    const entry = entries[index];
    if (!entry.description) return;
    const response = await improveContentApi({ content: entry.description });
    updateEntry(index, { description: response?.data?.improvedContent || entry.description });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline-md text-on-surface mb-1">Work Experience</h2>
        <p className="font-body-md text-on-surface-variant">
          Add your roles, most recent first.
        </p>
      </div>

      <div className="space-y-5">
        {entries.map((entry, index) => (
          <EntryCard key={index} onRemove={() => removeEntry(index)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Company"
                value={entry.company}
                onChange={(value) => updateEntry(index, { company: value })}
                placeholder="Acme Inc."
              />
              <TextField
                label="Position"
                value={entry.position}
                onChange={(value) => updateEntry(index, { position: value })}
                placeholder="Senior Engineer"
              />
              <TextField
                label="Start date"
                value={entry.startDate}
                onChange={(value) => updateEntry(index, { startDate: value })}
                placeholder="Jan 2022"
              />
              <TextField
                label="End date"
                value={entry.endDate}
                onChange={(value) => updateEntry(index, { endDate: value })}
                placeholder="Present"
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
                    value={getContext(index).experienceLevel}
                    onChange={(e) => setContext(index, { experienceLevel: e.target.value })}
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
                  value={getContext(index).techStack}
                  onChange={(value) => setContext(index, { techStack: value })}
                  placeholder="React, Node.js"
                />
                <TextField
                  label="Years of experience"
                  type="number"
                  value={getContext(index).yearsOfExperience}
                  onChange={(value) => setContext(index, { yearsOfExperience: value })}
                  placeholder="2"
                />
              </div>
              <AIActionButton label="Generate description with AI" onRun={() => generateDescription(index)} />
            </div>

            <div className="space-y-2">
              <TextAreaField
                label="Description"
                value={entry.description}
                onChange={(value) => updateEntry(index, { description: value })}
                placeholder="Describe your responsibilities and impact..."
              />
              <AIActionButton label="Improve with AI" onRun={() => improveDescription(index)} />
            </div>
          </EntryCard>
        ))}
      </div>

      <AddEntryButton label="Add work experience" onClick={addEntry} />
    </div>
  );
}
