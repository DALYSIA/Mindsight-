import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabaseServer";

export default async function Home() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
