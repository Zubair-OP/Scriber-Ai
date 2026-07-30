"use client";

import { useState } from "react";
import { generateProjectDescriptionApi, improveContentApi } from "@/apis/ai.api";
import { AIActionButton } from "@/components/builder/AIActionButton";
import { AddEntryButton, EntryCard, TextAreaField, TextField } from "@/components/builder/fields";
import { SortableList } from "@/components/builder/SortableList";
import { useEntryIds } from "@/components/builder/useEntryIds";
import type { StepProps } from "@/components/builder/types";
import type { IProjects } from "@/types/resume.types";

type Entry = IProjects & { _dndId?: string };

const emptyEntry: IProjects = { title: "", description: "", githubUrl: "", liveUrl: "", techStack: [] };

interface AiContext {
  jobTitle: string;
  experienceLevel: string;
}

const emptyContext: AiContext = { jobTitle: "", experienceLevel: "Mid-Level" };

export function ProjectsStep({ draft, updateDraft }: StepProps) {
  const rawEntries = (draft.projects || []) as Entry[];
  const entries = useEntryIds(rawEntries, (next) => updateDraft({ projects: next }));
  const [contexts, setContexts] = useState<Record<string, AiContext>>({});

  const getContext = (id: string) => contexts[id] || emptyContext;
  const setContext = (id: string, patch: Partial<AiContext>) => {
    setContexts((prev) => ({ ...prev, [id]: { ...getContext(id), ...patch } }));
  };

  const updateEntry = (id: string, patch: Partial<IProjects>) => {
    const next = entries.map((entry) => (entry._dndId === id ? { ...entry, ...patch } : entry));
    updateDraft({ projects: next });
  };

  const addEntry = () => updateDraft({ projects: [...entries, { ...emptyEntry }] });
  const removeEntry = (id: string) => updateDraft({ projects: entries.filter((entry) => entry._dndId !== id) });

  const generateDescription = async (id: string) => {
    const entry = entries.find((e) => e._dndId === id);
    if (!entry) return;
    const context = getContext(id);
    const response = await generateProjectDescriptionApi({
      jobTitle: context.jobTitle || entry.title || "Professional",
      experienceLevel: context.experienceLevel,
      techStack: entry.techStack?.length ? entry.techStack : ["General Software Development"],
    });
    updateEntry(id, { description: response?.data?.projectDescription || entry.description });
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
        <h2 className="font-headline-md text-on-surface mb-1">Projects</h2>
        <p className="font-body-md text-on-surface-variant">
          Showcase projects that demonstrate your skills.
        </p>
      </div>

      <SortableList
        items={entries}
        onReorder={(next) => updateDraft({ projects: next })}
        className="space-y-5"
        renderItem={(entry, _index, drag) => (
          <EntryCard onRemove={() => removeEntry(entry._dndId)} dragHandleProps={drag}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Project title"
                value={entry.title}
                onChange={(value) => updateEntry(entry._dndId, { title: value })}
                placeholder="Realtime Analytics Dashboard"
              />
              <TextField
                label="Tech stack (comma separated)"
                value={(entry.techStack || []).join(", ")}
                onChange={(value) =>
                  updateEntry(entry._dndId, { techStack: value.split(",").map((s) => s.trim()).filter(Boolean) })
                }
                placeholder="React, Node.js, MongoDB"
              />
              <TextField
                label="GitHub URL"
                value={entry.githubUrl}
                onChange={(value) => updateEntry(entry._dndId, { githubUrl: value })}
                placeholder="github.com/janedoe/project"
              />
              <TextField
                label="Live URL"
                value={entry.liveUrl}
                onChange={(value) => updateEntry(entry._dndId, { liveUrl: value })}
                placeholder="project.dev"
              />
            </div>

            <div className="p-4 rounded-xl bg-white border border-surface-variant space-y-3">
              <p className="font-label-sm text-on-surface-variant uppercase tracking-wide">
                AI context (used only to generate a draft — not saved)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextField
                  label="Target job title"
                  value={getContext(entry._dndId).jobTitle}
                  onChange={(value) => setContext(entry._dndId, { jobTitle: value })}
                  placeholder="Full Stack Developer"
                />
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Experience level</label>
                  <select
                    value={getContext(entry._dndId).experienceLevel}
                    onChange={(e) => setContext(entry._dndId, { experienceLevel: e.target.value })}
                    className="w-full px-3 py-2.5 border border-surface-variant rounded-xl bg-surface-subtle text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/30"
                  >
                    {["Fresher", "Mid-Level", "Senior-Level"].map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <AIActionButton label="Generate description with AI" onRun={() => generateDescription(entry._dndId)} />
            </div>

            <div className="space-y-2">
              <TextAreaField
                label="Description"
                value={entry.description}
                onChange={(value) => updateEntry(entry._dndId, { description: value })}
                placeholder="Describe what the project does and your role in it..."
                maxWords={120}
              />
              <AIActionButton label="Improve with AI" onRun={() => improveDescription(entry._dndId)} />
            </div>
          </EntryCard>
        )}
      />

      <AddEntryButton label="Add project" onClick={addEntry} />
    </div>
  );
}
