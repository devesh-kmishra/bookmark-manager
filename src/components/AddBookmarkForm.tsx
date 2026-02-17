"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase-client";

export default function AddBookmarkForm() {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    let formattedUrl = url.trim();

    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      new URL(formattedUrl);
    } catch {
      setError("Please enter a valid URL");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("bookmarks").insert({
      title: title.trim(),
      url: formattedUrl,
      user_id: user.id,
    });

    if (error) {
      setError(error.message);
    } else {
      setTitle("");
      setUrl("");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-md space-y-4 bg-white p-6 rounded-lg shadow-md"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">URL</label>
        <input
          type="text"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || !title || !url}
        className={`w-full p-2 rounded-md text-white ${loading || !title || !url ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-blue-500 cursor-pointer"}`}
      >
        {loading ? "Adding..." : "Add Bookmark"}
      </button>
    </form>
  );
}
