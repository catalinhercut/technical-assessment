export const locales = ["de", "fr", "it", "en"] as const;
export type Locale = (typeof locales)[number];

export const markets = ["CH-DE", "CH-FR", "CH-IT"] as const;
export type Market = (typeof markets)[number];

export const publicationStatuses = [
  "draft",
  "scheduled",
  "published",
  "archived",
] as const;
export type PublicationStatus = (typeof publicationStatuses)[number];
export type PublicationStatusFilter = PublicationStatus | "all";

export interface PromotionTranslation {
  title: string;
  bodyHtml: string;
  ctaLabel: string;
  ctaUrl: string;
}

export interface Promotion {
  id: string;
  name: string;
  status: PublicationStatus;
  markets: Market[];
  startAt: string;
  endAt: string;
  translations: Partial<Record<Locale, PromotionTranslation>>;
}

export interface PromotionPreview {
  promotionId: string;
  promotionName: string;
  requestedLocale: Locale;
  contentLocale: Locale;
  isFallback: boolean;
  title: string;
  bodyHtml: string;
  ctaLabel: string;
  ctaUrl: string;
}

export const localeLabels: Record<Locale, string> = {
  de: "German",
  fr: "French",
  it: "Italian",
  en: "English",
};

export const statusLabels: Record<PublicationStatusFilter, string> = {
  all: "All statuses",
  draft: "Draft",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
};
