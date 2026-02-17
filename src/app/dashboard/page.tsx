import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { LogoutButton } from "./LogoutButton";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: bookmarks, error } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center gap-4 mb-8">
        <h1 className="text-xl sm:text-2xl font-bold truncate">
          Welcome {user.user_metadata.full_name}
        </h1>
        <LogoutButton />
      </div>
      <div className="flex justify-center">
        <div className="w-md flex flex-col gap-8">
          <AddBookmarkForm />
          <BookmarkList initialBookmarks={bookmarks ?? []} />
        </div>
      </div>
    </div>
  );
}
