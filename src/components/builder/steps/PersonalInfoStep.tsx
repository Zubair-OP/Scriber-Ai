"use client";

import { TextField } from "@/components/builder/fields";
import type { StepProps } from "@/components/builder/types";

export function PersonalInfoStep({ draft, updateDraft }: StepProps) {
  const personalInfo = draft.personalInfo;

  const updateField = (key: keyof typeof personalInfo, value: string) => {
    updateDraft({ personalInfo: { ...personalInfo, [key]: value } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline-md text-on-surface mb-1">Personal Information</h2>
        <p className="font-body-md text-on-surface-variant">
          Tell us the basics — this appears at the top of every template.
        </p>
      </div>

      <TextField
        label="Resume title (for your dashboard only)"
        value={draft.title}
        onChange={(value) => updateDraft({ title: value })}
        placeholder="e.g. Senior Product Designer Resume"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="Full name"
          value={personalInfo.fullname}
          onChange={(value) => updateField("fullname", value)}
          placeholder="Jane Doe"
        />
        <TextField
          label="Email"
          type="email"
          value={personalInfo.email}
          onChange={(value) => updateField("email", value)}
          placeholder="jane@example.com"
        />
        <TextField
          label="Mobile"
          value={personalInfo.mobile}
          onChange={(value) => updateField("mobile", value)}
          placeholder="+1 555 123 4567"
        />
        <TextField
          label="Location"
          value={personalInfo.location}
          onChange={(value) => updateField("location", value)}
          placeholder="San Francisco, CA"
        />
        <TextField
          label="GitHub"
          value={personalInfo.github}
          onChange={(value) => updateField("github", value)}
          placeholder="github.com/janedoe"
        />
        <TextField
          label="LinkedIn"
          value={personalInfo.linkedIn}
          onChange={(value) => updateField("linkedIn", value)}
          placeholder="linkedin.com/in/janedoe"
        />
        <TextField
          label="Portfolio"
          value={personalInfo.portfolio}
          onChange={(value) => updateField("portfolio", value)}
          placeholder="janedoe.com"
        />
      </div>
    </div>
  );
}
