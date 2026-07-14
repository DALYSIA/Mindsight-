"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function ReplyPage({ params }: { params: { token: string } }) {
  const supabase = createClient();
  const [status, setStatus] = useState<"loading" | "ready" | "used" | "notfound" | "submitted">(
    "loading"
  );
  const [studyTitle, setStudyTitle] = useState("");
  const [promptMessage, setPromptMessage] = useState("");
  const [contactName, setContactName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.rpc("get_contact_by_token", {
        p_token: params.token,
      });
      if (error || !data || data.length === 0) {
        setStatus("notfound");
        return;
      }
      const row = data[0];
      if (row.used) {
        setStatus("used");
        return;
      }
      setStudyTitle(row.study_title);
      setPromptMessage(row.prompt_message);
      setContactName(row.contact_name);
      setStatus("ready");
    }
    load();
  }, [params.token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    setError("");
    const { error } = await supabase.rpc("submit_response", {
      p_token: params.token,
      p_body: body.trim(),
    });
    setSubmitting(false);
    if (error) {
      setError("Something went wrong submitting your response. Please try again.");
      return;
    }
    setStatus("submitted");
  }

  const wordCount = body.trim().length === 0 ? 0 : body.trim().split(/\s+/).length;

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="flex items-center gap-2 text-taupe">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-taupe animate-pulse" />
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-taupe animate-pulse [animation-delay:150ms]" />
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-taupe animate-pulse [animation-delay:300ms]" />
        </div>
      </main>
    );
  }

  if (status === "notfound") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-taupe mb-2">
            Link not found
          </p>
          <p className="text-sm text-taupe max-w-xs mx-auto">
            This link doesn't match anything. Please check it was copied correctly.
          </p>
        </div>
      </main>
    );
  }

  if (status === "used") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <div className="max-w-xs">
          <div className="w-10 h-10 rounded-full border border-sage/50 flex items-center justify-center mx-auto mb-4">
            <span className="text-sage text-sm">✓</span>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-sage mb-2">
            Already submitted
          </p>
          <p className="text-sm text-taupe">
            A response was already recorded for this link. Thank you for your time.
          </p>
        </div>
      </main>
    );
  }

  if (status === "submitted") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <div className="max-w-xs animate-[fadeIn_0.4s_ease-out]">
          <div className="w-10 h-10 rounded-full border border-sage/50 flex items-center justify-center mx-auto mb-4">
            <span className="text-sage text-sm">✓</span>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-sage mb-2">
            Thank you
          </p>
          <p className="text-sm text-taupe leading-relaxed">
            Your response has been recorded. This link is now closed, and your words are safe with the researcher.
          </p>
        </div>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="w-1 h-1 rounded-full bg-steel" />
          <p className="font-mono text-xs uppercase tracking-widest text-taupe">
            {studyTitle}
          </p>
          <span className="w-1 h-1 rounded-full bg-steel" />
        </div>

        <div className="border border-line bg-white/50 rounded-sm p-6 mb-6 shadow-sm">
          <p className="text-sm leading-relaxed">
            Hi {contactName || "there"} - {promptMessage}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={7}
              required
              placeholder="Write your thoughts here..."
              className="focus-ring ruled w-full border border-line bg-white/60 px-3 py-3 rounded-sm text-sm leading-[40px] resize-none"
              style={{ lineHeight: "40px" }}
            />
            <span className="absolute bottom-2 right-3 text-xs font-mono text-taupe/70">
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
          </div>

          {error && <p className="text-sm text-rust">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="focus-ring w-full bg-ink text-paper py-3 rounded-sm text-sm font-medium hover:bg-steel transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending..." : "Send response"}
          </button>
          <p className="text-xs text-taupe text-center pt-1">
            Your response will be reviewed as part of this research study. This link can only be used once.
          </p>
        </form>
      </div>
    </main>
  );
}    load();
  }, [params.token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    setError("");
    const { error } = await supabase.rpc("submit_response", {
      p_token: params.token,
      p_body: body.trim(),
    });
    setSubmitting(false);
    if (error) {
      setError("Something went wrong submitting your response. Please try again.");
      return;
    }
    setStatus("submitted");
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="text-sm text-taupe font-mono">Loading…</p>
      </main>
    );
  }

  if (status === "notfound") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-taupe mb-2">
            Link not found
          </p>
          <p className="text-sm text-taupe max-w-xs mx-auto">
            This link doesn't match anything. Please check it was copied correctly.
          </p>
        </div>
      </main>
    );
  }

  if (status === "used") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-sage mb-2">
            Already submitted
          </p>
          <p className="text-sm text-taupe max-w-xs mx-auto">
            A response was already recorded for this link. Thank you.
          </p>
        </div>
      </main>
    );
  }

  if (status === "submitted") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-sage mb-2">
            Thank you
          </p>
          <p className="text-sm text-taupe max-w-xs mx-auto">
            Your response has been recorded. This link is now closed.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="font-mono text-xs uppercase tracking-widest text-taupe mb-2 text-center">
          {studyTitle}
        </p>
        <div className="border border-line bg-white/50 rounded-sm p-6 mb-6">
          <p className="text-sm leading-relaxed">
            Hi {contactName || "there"} — {promptMessage}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            required
            placeholder="Write your thoughts here…"
            className="focus-ring w-full border border-line bg-white/60 px-3 py-3 rounded-sm text-sm leading-relaxed"
          />
          {error && <p className="text-sm text-rust">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="focus-ring w-full bg-ink text-paper py-3 rounded-sm text-sm font-medium hover:bg-steel transition-colors disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Send response"}
          </button>
          <p className="text-xs text-taupe text-center pt-1">
            Your response will be reviewed as part of this research study. This link can only be used once.
          </p>
        </form>
      </div>
    </main>
  );
}
