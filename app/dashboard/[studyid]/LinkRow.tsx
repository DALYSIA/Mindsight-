"use client";

import { useState } from "react";

export default function LinkRow({ contact, index }: { contact: any; index: number }) {
  const [copied, setCopied] = useState(false);

  function getUrl() {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/r/${contact.token}`;
  }

  async function handleCopy() {
    const url = getUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // no-op
    }
  }

  return (
    <li className="flex items-center justify-between py-3 gap-3">
      <div className="flex items-baseline gap-3 min-w-0">
        <span className="font-mono text-xs text-taupe shrink-0">
          {String(index + 1).padStart(3, "0")}
        </span>
        <span className="text-sm truncate">{contact.name}</span>
        {contact.used && (
          <span className="text-xs font-mono text-sage shrink-0">replied</span>
        )}
      </div>
      <button
        onClick={handleCopy}
        className="focus-ring shrink-0 text-xs font-mono px-3 py-1 border border-line rounded-sm hover:bg-ink hover:text-paper transition-colors"
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </li>
  );
}
