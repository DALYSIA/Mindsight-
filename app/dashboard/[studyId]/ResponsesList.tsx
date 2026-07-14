"use client";

import { useMemo, useState } from "react";
import ResponseCard from "./ResponseCard";

export default function ResponsesList({ responses }: { responses: any[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");

  const tags = useMemo(() => {
    const set = new Set<string>();
    responses.forEach((r) => r.tag && set.add(r.tag));
    return Array.from(set);
  }, [responses]);

  const filtered = responses.filter((r) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !query ||
      (r.body || "").toLowerCase().includes(q) ||
      (r.contacts?.name || "").toLowerCase().includes(q);
    const matchesTag = activeTag === "all" || r.tag === activeTag;
    return matchesQuery && matchesTag;
  });

  if (responses.length === 0) {
    return (
      <div className="border border-dashed border-line rounded-sm p-8 text-center">
        <p className="text-sm text-taupe">
          No replies yet. Once someone submits, it'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search replies..."
          className="focus-ring flex-1 border border-line bg-white/60 px-3 py-2 rounded-sm text-sm"
        />
        {tags.length > 0 && (
          <select
            value={activeTag}
            onChange={(e) => setActiveTag(e.target.value)}
            className="focus-ring border border-line bg-white/60 px-3 py-2 rounded-sm text-sm"
          >
            <option value="all">All tags</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-taupe text-center py-8">No replies match your search.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((r, i) => (
            <ResponseCard key={r.id} response={r} index={i} total={filtered.length} />
          ))}
        </ul>
      )}
    </div>
  );
}
