"use client";

import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="p-2 border text-white bg-blue-500 border-blue-500 rounded-md cursor-pointer hover:bg-red-500 hover:border-red-400"
    >
      Log out
    </button>
  );
}
