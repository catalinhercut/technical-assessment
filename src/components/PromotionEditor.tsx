import {
  localeLabels,
  locales,
  markets,
  type Locale,
  type Market,
  type Promotion,
  type PromotionTranslation,
} from "../models/promotion";

interface PromotionEditorProps {
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

export function PromotionEditor({
  promotion,
  locale,
  onLocaleChange,
  onPromotionChange,
}: PromotionEditorProps) {
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
    <section className="panel editor-panel" aria-labelledby="editor-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Content editor</p>
          <h2 id="editor-title">{promotion.name}</h2>
        </div>
        <span className="record-id">ID: {promotion.id}</span>
      </div>

      <fieldset className="market-controls">
        <legend>Markets</legend>
        <div className="checkbox-row">
          {markets.map((market) => (
            <label key={market}>
              <input
                type="checkbox"
                checked={promotion.markets.includes(market)}
                onChange={() => toggleMarket(market)}
              />
              {market}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form-grid">
        <label>
          Title
          <input
            value={translation.title}
            onChange={(event) =>
              updateTranslation("title", event.target.value)
            }
          />
        </label>

        <label>
          Body HTML
          <textarea
            rows={5}
            value={translation.bodyHtml}
            onChange={(event) =>
              updateTranslation("bodyHtml", event.target.value)
            }
          />
        </label>

        <div className="form-grid form-grid--two-columns">
          <label>
            CTA label
            <input
              value={translation.ctaLabel}
              onChange={(event) =>
                updateTranslation("ctaLabel", event.target.value)
              }
            />
          </label>

          <label>
            CTA URL
            <input
              inputMode="url"
              value={translation.ctaUrl}
              onChange={(event) =>
                updateTranslation("ctaUrl", event.target.value)
              }
            />
          </label>
        </div>

        <div className="form-grid form-grid--two-columns">
          <label>
            Starts at
            <input
              type="datetime-local"
              value={promotion.startAt}
              onChange={(event) =>
                onPromotionChange({
                  ...promotion,
                  startAt: event.target.value,
                })
              }
            />
          </label>

          <label>
            Ends at
            <input
              type="datetime-local"
              value={promotion.endAt}
              onChange={(event) =>
                onPromotionChange({
                  ...promotion,
                  endAt: event.target.value,
                })
              }
            />
          </label>
        </div>
      </div>
    </section>
  );
}
