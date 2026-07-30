"use client";

import { useMemo, useState } from "react";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import { generateSkillsApi } from "@/apis/ai.api";
import { AIActionButton } from "@/components/builder/AIActionButton";
import { TextField } from "@/components/builder/fields";
import { SortableList, type DragHandleProps } from "@/components/builder/SortableList";
import type { StepProps } from "@/components/builder/types";

interface SkillTag {
  value: string;
  _dndId: string;
}

function TagList({
  items,
  onRemove,
  onReorder,
}: {
  items: SkillTag[];
  onRemove: (id: string) => void;
  onReorder: (next: SkillTag[]) => void;
}) {
  if (items.length === 0) {
    return <p className="font-body-md text-on-surface-variant">No skills added yet.</p>;
  }

  return (
    <SortableList
      items={items}
      onReorder={onReorder}
      strategy={rectSortingStrategy}
      modifiers={[]}
      className="flex flex-wrap gap-2"
      renderItem={(item, _index, drag) => <SkillChip tag={item} drag={drag} onRemove={() => onRemove(item._dndId)} />}
    />
  );
}

function SkillChip({ tag, drag, onRemove }: { tag: SkillTag; drag: DragHandleProps; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-primary/8 text-primary font-label-sm pl-1 pr-3 py-1.5 rounded-full border border-primary/15">
      <button
        type="button"
        {...drag.attributes}
        {...drag.listeners}
        className="cursor-grab active:cursor-grabbing text-primary/50 hover:text-primary touch-none"
        aria-label="Drag to reorder"
      >
        <span className="material-symbols-outlined text-[16px]">drag_indicator</span>
      </button>
      {tag.value}
      <button type="button" onClick={onRemove} aria-label={`Remove ${tag.value}`} className="hover:text-red-600">
        <span className="material-symbols-outlined text-[14px]">close</span>
      </button>
    </span>
  );
}

export function SkillsStep({ draft, updateDraft }: StepProps) {
  // Derived (not backfilled) so identical skills always resolve to the same
  // stable id within a single snapshot of draft.skills — a per-render `.map`
  // into fresh {value} objects would otherwise never converge, since each
  // render would see "new" objects lacking an id and loop forever.
  const tags: SkillTag[] = useMemo(
    () => draft.skills.map((value, index) => ({ value, _dndId: `${index}-${value}` })),
    [draft.skills]
  );

  const [newSkill, setNewSkill] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Mid-Level");

  const addSkill = () => {
    const value = newSkill.trim();
    if (!value || draft.skills.includes(value)) return;
    updateDraft({ skills: [...draft.skills, value] });
    setNewSkill("");
  };

  const removeSkill = (id: string) => {
    updateDraft({ skills: tags.filter((t) => t._dndId !== id).map((t) => t.value) });
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
        <TagList
          items={tags}
          onRemove={removeSkill}
          onReorder={(next) => updateDraft({ skills: next.map((t) => t.value) })}
        />
      </div>
    </div>
  );
}
