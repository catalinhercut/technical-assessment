import {
  statusLabels,
  type Promotion,
} from "../models/promotion";

interface PromotionListProps {
  promotions: Promotion[];
  selectedId: string | null;
  onSelect: (promotionId: string) => void;
}

export function PromotionList({
  promotions,
  selectedId,
  onSelect,
}: PromotionListProps) {
  if (promotions.length === 0) {
    return <p className="muted">No promotions match this filter.</p>;
  }

  return (
    <ul className="promotion-list" aria-label="Promotions">
      {promotions.map((promotion) => {
        const selected = promotion.id === selectedId;

        return (
          <li key={promotion.id}>
            <button
              type="button"
              className="promotion-list__item"
              data-selected={selected}
              aria-pressed={selected}
              onClick={() => onSelect(promotion.id)}
            >
              <span>{promotion.name}</span>
              <span className={`status-badge status-badge--${promotion.status}`}>
                {statusLabels[promotion.status]}
              </span>
              <small>{promotion.markets.join(" · ")}</small>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
