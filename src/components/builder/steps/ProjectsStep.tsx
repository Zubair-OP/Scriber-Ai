"use client";

import { useState } from "react";
import { generateProjectDescriptionApi, improveContentApi } from "@/apis/ai.api";
import { AIActionButton } from "@/components/builder/AIActionButton";
import { AddEntryButton, EntryCard, TextAreaField, TextField } from "@/components/builder/fields";
import type { StepProps } from "@/components/builder/types";
import type { IProjects } from "@/types/resume.types";

const emptyEntry: IProjects = { title: "", description: "", githubUrl: "", liveUrl: "", techStack: [] };

interface AiContext {
  jobTitle: string;
  experienceLevel: string;
}

const emptyContext: AiContext = { jobTitle: "", experienceLevel: "Mid-Level" };

export function ProjectsStep({ draft, updateDraft }: StepProps) {
  const entries = draft.projects || [];
  const [contexts, setContexts] = useState<Record<number, AiContext>>({});

  const getContext = (index: number) => contexts[index] || emptyContext;
  const setContext = (index: number, patch: Partial<AiContext>) => {
    setContexts((prev) => ({ ...prev, [index]: { ...getContext(index), ...patch } }));
  };

  const updateEntry = (index: number, patch: Partial<IProjects>) => {
    const next = entries.map((entry, i) => (i === index ? { ...entry, ...patch } : entry));
    updateDraft({ projects: next });
  };

  const addEntry = () => updateDraft({ projects: [...entries, { ...emptyEntry }] });
  const removeEntry = (index: number) => updateDraft({ projects: entries.filter((_, i) => i !== index) });

  const generateDescription = async (index: number) => {
    const entry = entries[index];
    const context = getContext(index);
    const response = await generateProjectDescriptionApi({
      jobTitle: context.jobTitle || entry.title || "Professional",
      experienceLevel: context.experienceLevel,
      techStack: entry.techStack?.length ? entry.techStack : ["General Software Development"],
    });
    updateEntry(index, { description: response?.data?.projectDescription || entry.description });
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
        <h2 className="font-headline-md text-on-surface mb-1">Projects</h2>
        <p className="font-body-md text-on-surface-variant">
          Showcase projects that demonstrate your skills.
        </p>
      </div>

      <div className="space-y-5">
        {entries.map((entry, index) => (
          <EntryCard key={index} onRemove={() => removeEntry(index)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Project title"
                value={entry.title}
                onChange={(value) => updateEntry(index, { title: value })}
                placeholder="Realtime Analytics Dashboard"
              />
              <TextField
                label="Tech stack (comma separated)"
                value={(entry.techStack || []).join(", ")}
                onChange={(value) =>
                  updateEntry(index, { techStack: value.split(",").map((s) => s.trim()).filter(Boolean) })
                }
                placeholder="React, Node.js, MongoDB"
              />
              <TextField
                label="GitHub URL"
                value={entry.githubUrl}
                onChange={(value) => updateEntry(index, { githubUrl: value })}
                placeholder="github.com/janedoe/project"
              />
              <TextField
                label="Live URL"
                value={entry.liveUrl}
                onChange={(value) => updateEntry(index, { liveUrl: value })}
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
                  value={getContext(index).jobTitle}
                  onChange={(value) => setContext(index, { jobTitle: value })}
                  placeholder="Full Stack Developer"
                />
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Experience level</label>
                  <select
                    value={getContext(index).experienceLevel}
                    onChange={(e) => setContext(index, { experienceLevel: e.target.value })}
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
              <AIActionButton label="Generate description with AI" onRun={() => generateDescription(index)} />
            </div>

            <div className="space-y-2">
              <TextAreaField
                label="Description"
                value={entry.description}
                onChange={(value) => updateEntry(index, { description: value })}
                placeholder="Describe what the project does and your role in it..."
              />
              <AIActionButton label="Improve with AI" onRun={() => improveDescription(index)} />
            </div>
          </EntryCard>
        ))}
      </div>

      <AddEntryButton label="Add project" onClick={addEntry} />
    </div>
  );
}
