import type { Promotion } from "../models/promotion";

interface WorkspaceSummaryProps {
  promotions: Promotion[];
}

export function WorkspaceSummary({ promotions }: WorkspaceSummaryProps) {
  const drafts = promotions.filter(
    (promotion) => promotion.status === "draft",
  ).length;
  const scheduled = promotions.filter(
    (promotion) => promotion.status === "scheduled",
  ).length;
  const published = promotions.filter(
    (promotion) => promotion.status === "published",
  ).length;
  const markets = new Set(
    promotions.flatMap((promotion) => promotion.markets),
  ).size;

  const metrics = [
    {
      label: "Total promotions",
      value: promotions.length,
      detail: "Across all statuses",
      tone: "neutral",
    },
    {
      label: "Draft review",
      value: drafts,
      detail: "Needs content approval",
      tone: "draft",
    },
    {
      label: "Scheduled",
      value: scheduled,
      detail: "In publishing queue",
      tone: "scheduled",
    },
    {
      label: "Live coverage",
      value: published,
      detail: `${markets} active markets`,
      tone: "published",
    },
  ];

  return (
    <section className="workspace-summary" aria-label="Promotion overview">
      {metrics.map((metric) => (
        <article
          className="summary-card"
          data-tone={metric.tone}
          key={metric.label}
        >
          <div className="summary-card__topline">
            <span>{metric.label}</span>
            <span className="summary-card__signal" aria-hidden="true" />
          </div>
          <strong>{metric.value.toString().padStart(2, "0")}</strong>
          <small>{metric.detail}</small>
        </article>
      ))}
    </section>
  );
}
