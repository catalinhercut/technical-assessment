import {
  publicationStatuses,
  statusLabels,
  type PublicationStatusFilter,
} from "../models/promotion";

interface PromotionFiltersProps {
  value: PublicationStatusFilter;
  onChange: (status: PublicationStatusFilter) => void;
}

export function PromotionFilters({
  value,
  onChange,
}: PromotionFiltersProps) {
  return (
    <div className="promotion-filters">
      <label htmlFor="status-filter">Publication status</label>
      <select
        id="status-filter"
        value={value}
        onChange={(event) =>
          onChange(event.target.value as PublicationStatusFilter)
        }
      >
        <option value="all">{statusLabels.all}</option>
        {publicationStatuses.map((status) => (
          <option key={status} value={status}>
            {statusLabels[status]}
          </option>
        ))}
      </select>
    </div>
  );
}
