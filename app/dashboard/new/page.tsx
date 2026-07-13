"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/lib/supabaseClient";
import Link from "next/link";

export default function NewStudyPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [promptMessage, setPromptMessage] = useState(
    "Hi, this is for a short study and research project. I'd love to hear your honest point of view - it'll only take a minute."
  );
  const [csvText, setCsvText] = useState("");
  const [rows, setRows] = useState<{ name: string }[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        const parsed = data
          .map((r) => ({ name: (r.name || r.Name || Object.values(r)[0] || "").toString().trim() }))
          .filter((r) => r.name.length > 0);
        setRows(parsed);
        setCsvText(parsed.length + " contact(s) loaded from file.");
      },
      error: () => setError("Could not read that CSV file."),
    });
  }

  function handlePasteParse(text: string) {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    setRows(lines.map((name) => ({ name })));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Give your study a title.");
      return;
    }
    if (rows.length === 0) {
      setError("Add at least one contact (upload a CSV or paste names, one per line).");
      return;
    }
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You've been signed out. Please sign in again.");
      setLoading(false);
      return;
    }

    const { data: study, error: studyError } = await supabase
      .from("studies")
      .insert({ title: title.trim(), prompt_message: promptMessage.trim(), admin_id: user.id })
      .select()
      .single();

    if (studyError || !study) {
      setError(studyError?.message || "Could not create the study.");
      setLoading(false);
      return;
    }

    const contactRows = rows.map((r) => ({
      study_id: study.id,
      name: r.name,
      token: uuidv4(),
    }));

    const { error: contactsError } = await supabase.from("contacts").insert(contactRows);

    if (contactsError) {
      setError(contactsError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/dashboard/" + study.id);
  }

  return (
    <main className="min-h-screen px-6 py-10 max-w-2xl mx-auto">
      <Link href="/dashboard" className="focus-ring text-xs font-mono text-taupe hover:text-ink">
        Back
      </Link>

      <h1 className="font-display text-2xl font-medium mt-4 mb-8">New study</h1>

      <form onSubmit={handleCreate} className="space-y-8">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-taupe mb-1">
            Study title (for you only)
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="focus-ring w-full border border-line bg-white/60 px-3 py-2 rounded-sm text-sm"
            placeholder="e.g. Beauty Entrepreneurs Mindset"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-taupe mb-1">
            Disclosure message shown to each contact
          </label>
          <textarea
            value={promptMessage}
            onChange={(e) => setPromptMessage(e.target.value)}
            rows={3}
            className="focus-ring w-full border border-line bg-white/60 px-3 py-2 rounded-sm text-sm"
          />
          <p className="text-xs text-taupe mt-1">
            This is shown on the reply page itself, so people know it's research before they write anything.
          </p>
        </div>

        <div className="border-t border-line pt-6">
          <label className="block text-xs font-mono uppercase tracking-wide text-taupe mb-2">
            Contacts
          </label>
          <div className="space-y-3">
            <div>
              <input type="file" accept=".csv" onChange={handleFile} className="text-sm" />
              {csvText && <p className="text-xs text-sage mt-1">{csvText}</p>}
            </div>
            <p className="text-xs text-taupe text-center">or paste below</p>
            <textarea
              placeholder="Paste one name per line"
              rows={4}
              onChange={(e) => handlePasteParse(e.target.value)}
              className="focus-ring w-full border border-line bg-white/60 px-3 py-2 rounded-sm text-sm"
            />
          </div>
          {rows.length > 0 && (
            <p className="text-xs text-taupe mt-2">{rows.length} contact(s) ready.</p>
          )}
        </div>

        {error && <p className="text-sm text-rust">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="focus-ring bg-ink text-paper px-5 py-2 rounded-sm text-sm font-medium hover:bg-steel transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create study & generate links"}
        </button>
      </form>
    </main>
  );
}
