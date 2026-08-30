"use client";

import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite } from "@/lib/storage";

export default function FavoriteButton({ id }: { id: string }) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen after mount to avoid SSR/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFav(isFavorite(id));
  }, [id]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(id);
        setFav((f) => !f);
      }}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      title={fav ? "Remove from favorites" : "Add to favorites"}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-base transition hover:bg-amber-100 active:scale-95 dark:border-amber-900/50 dark:bg-amber-950/40 dark:hover:bg-amber-950/70"
    >
      {fav ? "⭐" : "☆"}
    </button>
  );
}
