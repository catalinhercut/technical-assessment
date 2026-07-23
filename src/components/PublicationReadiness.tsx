import type { Promotion } from "../models/promotion";

interface PublicationReadinessProps {
  promotion: Promotion;
  onPublish?: (promotion: Promotion) => void;
}

export function PublicationReadiness({
  promotion,
  onPublish,
}: PublicationReadinessProps) {
  const isReady = false;

  return (
    <section className="panel readiness-panel" aria-labelledby="readiness-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Pre-publication check</p>
          <h2 id="readiness-title">Publication readiness</h2>
        </div>
      </div>

      <div className="readiness-summary" data-ready={isReady}>
        <span aria-hidden="true">{isReady ? "✓" : "!"}</span>
        <strong>
          {isReady ? "Ready to publish" : "Not ready to publish"}
        </strong>
      </div>

      <p className="muted">
        Readiness checks have not been implemented yet.
      </p>

      <button
        type="button"
        className="publish-button"
        disabled={!isReady}
        onClick={() => onPublish?.(promotion)}
      >
        Publish promotion
      </button>
    </section>
  );
}
