import { useEffect, useState } from "react";
import {
  getFeatureFlag,
  getPromotionActivity,
} from "../api/featureFlags";

interface PromotionActivityProps {
  promotionId: string;
}

interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
}

export function PromotionActivity({
  promotionId,
}: PromotionActivityProps) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    setEnabled(null);

    Promise.all([
      getFeatureFlag("promotion-activity"),
      getPromotionActivity(promotionId),
    ]).then(([flagEnabled, events]) => {
      setEnabled(flagEnabled);
      setActivity(events);
    });
  }, [promotionId]);

  if (enabled !== true) {
    return null;
  }

  return (
    <section className="panel activity-panel" aria-labelledby="activity-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Collaboration</p>
          <h2 id="activity-title">Promotion activity</h2>
        </div>
        <span className="feature-flag-label">Flagged feature</span>
      </div>

      <ol className="activity-timeline">
        {activity.map((item) => (
          <li key={item.id}>
            <span className="activity-avatar" aria-hidden="true">
              {item.actor
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
            <div>
              <strong>{item.actor}</strong>
              <p>{item.action}</p>
            </div>
            <time>{item.timestamp}</time>
          </li>
        ))}
      </ol>
    </section>
  );
}
