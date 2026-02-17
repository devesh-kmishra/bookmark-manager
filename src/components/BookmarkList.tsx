"use client";

import { createClient } from "@/lib/supabase-client";
import { useEffect, useState } from "react";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
  user_id: string;
};

type Props = {
  initialBookmarks: Bookmark[];
};

export default function BookmarkList({ initialBookmarks }: Props) {
  const supabase = createClient();
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setupRealtime = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userId = session?.user.id;
      if (!userId) return;

      channel = supabase
        .channel("bookmarks-realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              const newBookmark = payload.new as Bookmark;

              setBookmarks((prev) => {
                const exists = prev.some((b) => b.id === newBookmark.id);
                if (exists) return prev;
                return [newBookmark, ...prev];
              });
            }

            if (payload.eventType === "DELETE") {
              setBookmarks((prev) =>
                prev.filter((b) => b.id !== payload.old.id),
              );
            }
          },
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id: string) => {
    setLoadingId(id);

    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) {
      console.error(error.message);
    }

    setLoadingId(null);
  };

  return (
    <div className="space-y-4">
      {bookmarks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-2xl">It's lonely here...</p>
          <p className="text-sm mt-2">Add your first bookmark</p>
        </div>
      ) : (
        bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="p-4 rounded-lg shadow-md flex justify-between items-center hover:shadow-lg transition"
          >
            <div>
              <h2 className="font-semibold">{bookmark.title}</h2>
              <a
                href={bookmark.url}
                target="_blank"
                className="text-blue-600 text-sm"
              >
                {bookmark.url.startsWith("http://")
                  ? bookmark.url
                  : new URL(bookmark.url).hostname}
              </a>
            </div>

            <button
              onClick={() => handleDelete(bookmark.id)}
              disabled={loadingId === bookmark.id}
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm cursor-pointer hover:bg-red-700"
            >
              {loadingId === bookmark.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
