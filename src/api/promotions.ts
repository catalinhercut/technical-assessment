import type {
  Locale,
  Promotion,
  PromotionPreview,
  PromotionTranslation,
} from "../models/promotion";

const wait = (milliseconds: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("The operation was aborted", "AbortError"));
      return;
    }

    const timeoutId = window.setTimeout(resolve, milliseconds);

    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeoutId);
        reject(new DOMException("The operation was aborted", "AbortError"));
      },
      { once: true },
    );
  });

const emptyTranslation = (): PromotionTranslation => ({
  title: "",
  bodyHtml: "",
  ctaLabel: "",
  ctaUrl: "",
});

let promotions: Promotion[] = [
  {
    id: "welcome-bonus",
    name: "Welcome Bonus",
    status: "draft",
    markets: ["CH-DE", "CH-FR"],
    startAt: "2026-08-01T08:00",
    endAt: "2026-08-31T22:00",
    translations: {
      de: {
        title: "Willkommensbonus",
        bodyHtml:
          "<p>Starte mit einem besonderen Bonus in dein Casino-Erlebnis.</p>",
        ctaLabel: "Bonus entdecken",
        ctaUrl: "https://www.example.ch/de/willkommensbonus",
      },
      fr: {
        title: "Bonus de bienvenue",
        bodyHtml:
          "<p>Commencez votre expérience avec un bonus de bienvenue.</p>",
        ctaLabel: "",
        ctaUrl: "http://www.example.ch/fr/bonus",
      },
    },
  },
  {
    id: "weekend-spins",
    name: "Weekend Spins",
    status: "scheduled",
    markets: ["CH-DE", "CH-FR", "CH-IT"],
    startAt: "2026-08-07T17:00",
    endAt: "2026-08-10T06:00",
    translations: {
      de: {
        title: "Wochenend-Freispiele",
        bodyHtml: "<p>Drehe dieses Wochenende zusätzliche Runden.</p>",
        ctaLabel: "Jetzt spielen",
        ctaUrl: "https://www.example.ch/de/weekend-spins",
      },
      fr: {
        title: "Tours gratuits du week-end",
        bodyHtml:
          "<p>Profitez de tours supplémentaires pendant le week-end.</p>",
        ctaLabel: "Jouer",
        ctaUrl: "https://www.example.ch/fr/weekend-spins",
      },
      it: {
        title: "Giri del fine settimana",
        bodyHtml: "",
        ctaLabel: "Gioca",
        ctaUrl: "https://www.example.ch/it/weekend-spins",
      },
    },
  },
  {
    id: "summer-tournament",
    name: "Summer Tournament",
    status: "published",
    markets: ["CH-DE", "CH-IT"],
    startAt: "2026-07-01T09:00",
    endAt: "2026-09-01T09:00",
    translations: {
      de: {
        title: "Sommerturnier",
        bodyHtml: "<p>Sammle Punkte und klettere in der Rangliste.</p>",
        ctaLabel: "Rangliste ansehen",
        ctaUrl: "https://www.example.ch/de/sommerturnier",
      },
      it: {
        title: "Torneo estivo",
        bodyHtml: "<p>Raccogli punti e scala la classifica.</p>",
        ctaLabel: "Vedi classifica",
        ctaUrl: "https://www.example.ch/it/torneo-estivo",
      },
      en: {
        title: "Summer tournament",
        bodyHtml: "<p>Collect points and climb the leaderboard.</p>",
        ctaLabel: "View leaderboard",
        ctaUrl: "https://www.example.ch/en/summer-tournament",
      },
    },
  },
  {
    id: "spring-cashback",
    name: "Spring Cashback",
    status: "archived",
    markets: ["CH-DE"],
    startAt: "2026-03-01T08:00",
    endAt: "2026-04-01T08:00",
    translations: {
      de: {
        title: "Frühlings-Cashback",
        bodyHtml: "<p>Ein saisonales Cashback-Angebot.</p>",
        ctaLabel: "Details",
        ctaUrl: "https://www.example.ch/de/fruehlings-cashback",
      },
    },
  },
];

const mockDelays: Record<string, number> = {
  "welcome-bonus:de": 900,
  "weekend-spins:fr": 120,
  "welcome-bonus:fr": 700,
  "weekend-spins:de": 180,
  "weekend-spins:it": 320,
  "summer-tournament:it": 420,
};

const previewCache = new Map<string, PromotionPreview>();
const previewAttempts = new Map<string, number>();

const clonePromotion = (promotion: Promotion): Promotion =>
  structuredClone(promotion);

export async function getPromotions(): Promise<Promotion[]> {
  await wait(180);
  return promotions.map(clonePromotion);
}

function findTranslation(
  promotion: Promotion,
  locale: Locale,
): { translation: PromotionTranslation; contentLocale: Locale } {
  const selected = promotion.translations[locale];
  if (selected) {
    return { translation: selected, contentLocale: locale };
  }

  const germanFallback = promotion.translations.de;
  if (germanFallback) {
    return { translation: germanFallback, contentLocale: "de" };
  }

  return { translation: emptyTranslation(), contentLocale: locale };
}

async function requestPromotionPreview(
  promotionId: string,
  locale: Locale,
  signal?: AbortSignal,
): Promise<PromotionPreview> {
  const requestKey = `${promotionId}:${locale}`;
  await wait(mockDelays[requestKey] ?? 260, signal);

  const attempt = (previewAttempts.get(requestKey) ?? 0) + 1;
  previewAttempts.set(requestKey, attempt);

  if (requestKey === "summer-tournament:it" && attempt === 1) {
    throw new Error("The preview service is temporarily unavailable");
  }

  const promotion = promotions.find((item) => item.id === promotionId);
  if (!promotion) {
    throw new Error("Promotion not found");
  }

  const { translation, contentLocale } = findTranslation(promotion, locale);

  return {
    promotionId: promotion.id,
    promotionName: promotion.name,
    requestedLocale: locale,
    contentLocale,
    isFallback: contentLocale !== locale,
    ...translation,
  };
}

export async function getPromotionPreview(
  promotionId: string,
  locale: Locale,
  signal?: AbortSignal,
): Promise<PromotionPreview> {
  const cached = previewCache.get(promotionId);

  if (cached) {
    return structuredClone(cached);
  }

  const preview = await requestPromotionPreview(promotionId, locale, signal);
  previewCache.set(promotionId, preview);

  return structuredClone(preview);
}

export function updateMockPromotion(updatedPromotion: Promotion): void {
  promotions = promotions.map((promotion) =>
    promotion.id === updatedPromotion.id
      ? clonePromotion(updatedPromotion)
      : promotion,
  );
  previewCache.delete(updatedPromotion.id);
}

export function resetMockApi(): void {
  previewCache.clear();
  previewAttempts.clear();
}
