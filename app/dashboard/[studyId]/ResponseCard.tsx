"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";

const TAG_OPTIONS = ["Interesting", "Follow up", "Outlier"];

export default function ResponseCard({ response, index, total }: { response: any; index: number; total: number }) {
  const supabase = createClient();
  const [tag, setTag] = useState(response.tag || "");
  const [note, setNote] = useState(response.admin_note || "");
  const [saving, setSaving] = useState(false);

  async function handleTagChange(value: string) {
    const newTag = tag === value ? "" : value;
    setTag(newTag);
    setSaving(true);
    await supabase.from("responses").update({ tag: newTag || null }).eq("id", response.id);
    setSaving(false);
  }

  async function handleNoteBlur() {
    if (note === (response.admin_note || "")) return;
    setSaving(true);
    await supabase.from("responses").update({ admin_note: note || null }).eq("id", response.id);
    setSaving(false);
  }

  return (
    <li className="border border-line rounded-sm p-4 bg-white/40">
      <div className="flex items-baseline justify-between mb-2 gap-2">
        <span className="font-mono text-xs text-taupe truncate">
          {String(total - index).padStart(3, "0")} - {response.contacts?.name ?? "Unknown"}
        </span>
        <span className="font-mono text-xs text-taupe shrink-0">
          {new Date(response.created_at).toLocaleDateString()}
        </span>
      </div>

      <p className="text-sm leading-relaxed whitespace-pre-wrap mb-3">{response.body}</p>

      <div className="flex flex-wrap items-center gap-2 mb-2">
        {TAG_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => handleTagChange(option)}
            className={
              "focus-ring text-xs font-mono px-2 py-1 rounded-sm border transition-colors " +
              (tag === option
                ? "bg-steel text-paper border-steel"
                : "border-line text-taupe hover:border-steel hover:text-steel")
            }
          >
            {option}
          </button>
        ))}
        {saving && <span className="text-xs text-taupe">saving...</span>}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={handleNoteBlur}
        placeholder="Private note (only you see this)"
        rows={2}
        className="focus-ring w-full border border-dashed border-line bg-transparent px-2 py-1.5 rounded-sm text-xs text-taupe"
      />
    </li>
  );
}
