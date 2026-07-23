import { useEffect, useState } from "react";
import { getPromotionPreview } from "../api/promotions";
import type { Locale, PromotionPreview } from "../models/promotion";

interface PromotionPreviewState {
  preview: PromotionPreview | null;
  loading: boolean;
  error: string | null;
}

export function usePromotionPreview(
  promotionId: string | null,
  locale: Locale,
): PromotionPreviewState {
  const [preview, setPreview] = useState<PromotionPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!promotionId) {
      setPreview(null);
      return;
    }

    setLoading(true);
    setError(null);

    getPromotionPreview(promotionId, locale)
      .then((result) => {
        setPreview(result);
      })
      .catch((caughtError: unknown) => {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load preview",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [promotionId, locale]);

  return { preview, loading, error };
}
