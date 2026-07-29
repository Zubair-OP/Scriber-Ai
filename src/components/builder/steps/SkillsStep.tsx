"use client";

import { useState } from "react";
import { generateSkillsApi } from "@/apis/ai.api";
import { AIActionButton } from "@/components/builder/AIActionButton";
import { TextField } from "@/components/builder/fields";
import type { StepProps } from "@/components/builder/types";

function TagList({ items, onRemove }: { items: string[]; onRemove: (index: number) => void }) {
  if (items.length === 0) {
    return <p className="font-body-md text-on-surface-variant">No skills added yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="inline-flex items-center gap-1.5 bg-primary/8 text-primary font-label-sm px-3 py-1.5 rounded-full border border-primary/15"
        >
          {item}
          <button
            type="button"
            onClick={() => onRemove(index)}
            aria-label={`Remove ${item}`}
            className="hover:text-red-600"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </span>
      ))}
    </div>
  );
}

export function SkillsStep({ draft, updateDraft }: StepProps) {
  const [newSkill, setNewSkill] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Mid-Level");

  const addSkill = () => {
    const value = newSkill.trim();
    if (!value || draft.skills.includes(value)) return;
    updateDraft({ skills: [...draft.skills, value] });
    setNewSkill("");
  };

  const removeSkill = (index: number) => {
    updateDraft({ skills: draft.skills.filter((_, i) => i !== index) });
  };

  const handleGenerate = async () => {
    const response = await generateSkillsApi({ jobTitle, experienceLevel });
    const generated: string[] = Array.isArray(response?.data?.skills) ? response.data.skills : [];
    if (generated.length === 0) return;
    const merged = Array.from(new Set([...draft.skills, ...generated]));
    updateDraft({ skills: merged });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline-md text-on-surface mb-1">Skills</h2>
        <p className="font-body-md text-on-surface-variant">
          List the technical and professional skills relevant to your target role.
        </p>
      </div>

      <div className="p-4 rounded-2xl border border-surface-variant bg-surface-subtle/40 space-y-4">
        <p className="font-label-sm text-on-surface-variant uppercase tracking-wide">
          AI context (used only to generate suggestions)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Target job title"
            value={jobTitle}
            onChange={setJobTitle}
            placeholder="Data Analyst"
          />
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Experience level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-3 border border-surface-variant rounded-xl bg-surface-subtle text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/30"
            >
              {["Fresher", "Junior", "Mid-Level", "Senior"].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
        <AIActionButton label="Suggest skills with AI" onRun={handleGenerate} />
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add a skill and press Enter"
            className="flex-1 px-4 py-3 border border-surface-variant rounded-xl bg-surface-subtle placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container focus:bg-white transition-all text-sm"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-5 py-3 bg-primary-container text-white font-label-lg rounded-xl hover:bg-primary transition-colors"
          >
            Add
          </button>
        </div>
        <TagList items={draft.skills} onRemove={removeSkill} />
      </div>
    </div>
  );
}
