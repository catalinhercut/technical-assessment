import {
  localeLabels,
  locales,
  markets,
  type Locale,
  type Market,
  type Promotion,
  type PromotionTranslation,
} from "../models/promotion";

interface AppLanguageSwitcherProps {
  promotion: Promotion;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onPromotionChange: (promotion: Promotion) => void;
}

const blankTranslation = (): PromotionTranslation => ({
  title: "",
  bodyHtml: "",
  ctaLabel: "",
  ctaUrl: "",
});

export function AppLanguageSwitcher({
  promotion,
  locale,
  onLocaleChange,
  onPromotionChange,
}: AppLanguageSwitcherProps) {
  const translation = promotion.translations[locale] ?? blankTranslation();

  const updateTranslation = (
    field: keyof PromotionTranslation,
    value: string,
  ) => {
    onPromotionChange({
      ...promotion,
      translations: {
        ...promotion.translations,
        [locale]: {
          ...translation,
          [field]: value,
        },
      },
    });
  };

  const toggleMarket = (market: Market) => {
    const isSelected = promotion.markets.includes(market);
    const nextMarkets = isSelected
      ? promotion.markets.filter((item) => item !== market)
      : [...promotion.markets, market];

    onPromotionChange({ ...promotion, markets: nextMarkets });
  };

  return (
    <div>
  <fieldset className="language-picker">
        <legend>Working Language <span>G</span></legend>
        <div className="language-tabs">
          {locales.map((item) => (
            <button
              type="button"
              key={item}
              className="language-tab"
              data-selected={locale === item}
              aria-pressed={locale === item}
              onClick={() => onLocaleChange(item)}
            >
              {localeLabels[item]}
              {!promotion.translations[item] && (
                <span className="language-tab__missing">Missing</span>
              )}
            </button>
          ))}
        </div>
      </fieldset>
      </div>
  );
}
