import type { Locale } from "../models/promotion";
import { usePromotionPreview } from "../hooks/usePromotionPreview";
import { localeLabels } from "../models/promotion";
import { sanitizeCmsHtml } from "../utils/sanitizeCmsHtml";

interface PromotionPreviewProps {
  promotionId: string | null;
  locale: Locale;
}

export function PromotionPreview({
  promotionId,
  locale,
}: PromotionPreviewProps) {
  const { preview, loading, error } = usePromotionPreview(
    promotionId,
    locale,
  );

  return (
    <section className="panel preview-panel" aria-labelledby="preview-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Customer view</p>
          <h2 id="preview-title">Preview</h2>
        </div>
        <span className="locale-badge">{locale.toUpperCase()}</span>
      </div>

      {!promotionId && (
        <p className="preview-state">Select a promotion to see its preview.</p>
      )}

      {promotionId && loading && (
        <p className="preview-state" role="status">
          Loading {localeLabels[locale]} preview…
        </p>
      )}

      {promotionId && !loading && error && (
        <div className="preview-state preview-state--error" role="alert">
          <strong>Preview could not be loaded</strong>
          <p>{error}</p>
        </div>
      )}

      {promotionId && !loading && !error && preview && (
        <article className="promotion-card">
          {preview.isFallback && (
            <p className="fallback-notice">
              {localeLabels[preview.contentLocale]} fallback shown because{" "}
              {localeLabels[preview.requestedLocale]} is unavailable.
            </p>
          )}
          <p className="promotion-card__brand">Swiss Casinos</p>
          <h3>{preview.title || "Untitled promotion"}</h3>
          {preview.bodyHtml ? (
            <div
              className="promotion-card__body"
              dangerouslySetInnerHTML={{
                __html: sanitizeCmsHtml(preview.bodyHtml),
              }}
            />
          ) : (
            <p className="muted">No body content is available.</p>
          )}
          {preview.ctaLabel && preview.ctaUrl && (
            <a className="preview-cta" href={preview.ctaUrl}>
              {preview.ctaLabel}
            </a>
          )}
        </article>
      )}
    </section>
  );
}
