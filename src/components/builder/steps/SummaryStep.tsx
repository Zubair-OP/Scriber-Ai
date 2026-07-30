"use client";

import { useState } from "react";
import { generateSummaryApi, improveContentApi } from "@/apis/ai.api";
import { AIActionButton } from "@/components/builder/AIActionButton";
import { TextAreaField, TextField } from "@/components/builder/fields";
import type { StepProps } from "@/components/builder/types";

const EXPERIENCE_LEVELS = ["Fresher", "Junior", "Mid-Level", "Senior"];

export function SummaryStep({ draft, updateDraft }: StepProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Mid-Level");
  const [contextSkills, setContextSkills] = useState(draft.skills.join(", "));

  const handleGenerate = async () => {
    const response = await generateSummaryApi({
      jobTitle,
      experienceLevel,
      skills: contextSkills.split(",").map((s) => s.trim()).filter(Boolean),
    });
    updateDraft({ summary: response?.data?.summary || draft.summary });
  };

  const handleImprove = async () => {
    if (!draft.summary) return;
    const response = await improveContentApi({ content: draft.summary });
    updateDraft({ summary: response?.data?.improvedContent || draft.summary });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline-md text-on-surface mb-1">Professional Summary</h2>
        <p className="font-body-md text-on-surface-variant">
          A short, punchy overview of who you are professionally.
        </p>
      </div>

      <div className="p-4 rounded-2xl border border-surface-variant bg-surface-subtle/40 space-y-4">
        <p className="font-label-sm text-on-surface-variant uppercase tracking-wide">
          AI context (used only to generate a draft — not saved)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Target job title"
            value={jobTitle}
            onChange={setJobTitle}
            placeholder="Product Designer"
          />
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Experience level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-3 border border-surface-variant rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container focus:bg-white transition-all text-sm"
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
        <TextField
          label="Key skills (comma separated)"
          value={contextSkills}
          onChange={setContextSkills}
          placeholder="Figma, User Research, Design Systems"
        />
        <AIActionButton
          label="Generate summary with AI"
          onRun={handleGenerate}
        />
      </div>

      <div className="space-y-2">
        <TextAreaField
          label="Summary"
          value={draft.summary}
          onChange={(value) => updateDraft({ summary: value })}
          placeholder="Write a 2-4 sentence professional summary..."
          rows={6}
          maxWords={80}
        />
        <AIActionButton label="Improve with AI" onRun={handleImprove} />
      </div>
    </div>
  );
}
