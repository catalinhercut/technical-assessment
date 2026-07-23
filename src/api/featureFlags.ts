export type FeatureFlagName = "promotion-activity";

interface PromotionActivityEvent {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
}

const flags: Record<FeatureFlagName, boolean> = {
  "promotion-activity": true,
};
let flagServiceAvailable = true;

const wait = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export async function getFeatureFlag(
  flag: FeatureFlagName,
): Promise<boolean> {
  await wait(180);
  if (!flagServiceAvailable) {
    throw new Error("Feature flag service unavailable");
  }
  return flags[flag];
}

export async function getPromotionActivity(
  promotionId: string,
): Promise<PromotionActivityEvent[]> {
  await wait(240);

  return [
    {
      id: `${promotionId}:review`,
      actor: "Luca Bianchi",
      action: "Requested translation review",
      timestamp: "Today, 09:42",
    },
    {
      id: `${promotionId}:schedule`,
      actor: "Anna Müller",
      action: "Updated the campaign schedule",
      timestamp: "Yesterday, 16:18",
    },
    {
      id: `${promotionId}:content`,
      actor: "Sophie Dubois",
      action: "Edited French content",
      timestamp: "Yesterday, 11:06",
    },
  ];
}

export function setMockFeatureFlag(
  flag: FeatureFlagName,
  enabled: boolean,
): void {
  flags[flag] = enabled;
}

export function setMockFeatureFlagServiceAvailable(
  available: boolean,
): void {
  flagServiceAvailable = available;
}
