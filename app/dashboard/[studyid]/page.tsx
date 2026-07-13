import Link from "next/link";
import { createServerSupabase } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import LinkRow from "./LinkRow";
import ExportButton from "./ExportButton";

export default async function StudyPage({ params }: { params: { studyId: string } }) {
  const supabase = createServerSupabase();

  const { data: study } = await supabase
    .from("studies")
    .select("*")
    .eq("id", params.studyId)
    .single();

  if (!study) notFound();

  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .eq("study_id", params.studyId)
    .order("created_at", { ascending: true });

  const { data: responses } = await supabase
    .from("responses")
    .select("*, contacts(name)")
    .eq("study_id", params.studyId)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
      <Link href="/dashboard" className="focus-ring text-xs font-mono text-taupe hover:text-ink">
        ← All studies
      </Link>

      <div className="mt-4 mb-10">
        <h1 className="font-display text-2xl font-medium">{study.title}</h1>
        <p className="text-sm text-taupe mt-1 italic">&ldquo;{study.prompt_message}&rdquo;</p>
      </div>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-mono text-xs uppercase tracking-widest text-taupe">
            Links to send ({contacts?.length ?? 0})
          </h2>
        </div>
        <ul className="divide-y divide-line border-t border-b border-line">
          {contacts?.map((c: any, i: number) => (
            <LinkRow key={c.id} index={i} contact={c} />
          ))}
          {(!contacts || contacts.length === 0) && (
            <li className="py-4 text-sm text-taupe">No contacts added.</li>
          )}
        </ul>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-mono text-xs uppercase tracking-widest text-taupe">
            Replies ({responses?.length ?? 0})
          </h2>
          {responses && responses.length > 0 && <ExportButton responses={responses} title={study.title} />}
        </div>

        {(!responses || responses.length === 0) && (
          <div className="border border-dashed border-line rounded-sm p-8 text-center">
            <p className="text-sm text-taupe">
              No replies yet. Once someone submits, it'll appear here.
            </p>
          </div>
        )}

        <ul className="space-y-4">
          {responses?.map((r: any, i: number) => (
            <li key={r.id} className="border border-line rounded-sm p-4 bg-white/40">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-mono text-xs text-taupe">
                  {String(responses.length - i).padStart(3, "0")} — {r.contacts?.name ?? "Unknown"}
                </span>
                <span className="font-mono text-xs text-taupe">
                  {new Date(r.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{r.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
