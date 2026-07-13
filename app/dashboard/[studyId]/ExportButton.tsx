"use client";

export default function ExportButton({ responses, title }: { responses: any[]; title: string }) {
  function handleExport() {
    const header = ["name", "response", "submitted_at"];
    const rows = responses.map((r) => [
      r.contacts?.name ?? "",
      `"${(r.body || "").replace(/"/g, '""')}"`,
      r.created_at,
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}_responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="focus-ring text-xs font-mono px-3 py-1 border border-line rounded-sm hover:bg-ink hover:text-paper transition-colors"
    >
      Export CSV
    </button>
  );
}
