import Link from "next/link";
import { createServerSupabase } from "@/lib/supabaseServer";
import SignOutButton from "./SignOutButton";

export default async function DashboardPage() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: studies } = await supabase
    .from("studies")
    .select("id, title, created_at, contacts(count), responses(count)")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-12">
        <div>
          <p className="font-mono text-xs tracking-widest text-taupe uppercase mb-1">
            Fieldnote
          </p>
          <h1 className="font-display text-2xl font-medium">Your studies</h1>
        </div>
        <SignOutButton />
      </header>

      <div className="mb-8">
        <Link
          href="/dashboard/new"
          className="focus-ring inline-block bg-ink text-paper px-4 py-2 rounded-sm text-sm font-medium hover:bg-steel transition-colors"
        >
          + New study
        </Link>
      </div>

      {(!studies || studies.length === 0) && (
        <div className="border border-dashed border-line rounded-sm p-10 text-center">
          <p className="text-taupe text-sm">
            No studies yet. Start one to begin collecting points of view.
          </p>
        </div>
      )}

      <ul className="divide-y divide-line border-t border-b border-line">
        {studies?.map((study: any, i: number) => (
          <li key={study.id}>
            <Link
              href={`/dashboard/${study.id}`}
              className="focus-ring flex items-center justify-between py-4 group"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-taupe">
                  {String(i + 1).padStart(3, "0")}
                </span>
                <span className="font-display text-lg group-hover:text-steel transition-colors">
                  {study.title}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-taupe">
                <span>{study.contacts?.[0]?.count ?? 0} contacts</span>
                <span>{study.responses?.[0]?.count ?? 0} replies</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
