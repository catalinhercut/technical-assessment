import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  getPromotions,
  updateMockPromotion,
} from "./api/promotions";
import { PromotionEditor } from "./components/PromotionEditor";
import { PromotionFilters } from "./components/PromotionFilters";
import { PromotionList } from "./components/PromotionList";
import { PromotionPreview } from "./components/PromotionPreview";
import { PublicationReadiness } from "./components/PublicationReadiness";
import type {
  Locale,
  Promotion,
  PublicationStatusFilter,
} from "./models/promotion";

function PromotionsWorkspace() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [status, setStatus] = useState<PublicationStatusFilter>("all");
  const [locale, setLocale] = useState<Locale>("de");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getPromotions()
      .then((result) => {
        if (!active) {
          return;
        }
        setPromotions(result);
        setSelectedId(result[0]?.id ?? null);
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }
        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load promotions",
        );
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredPromotions = useMemo(
    () =>
      status === "all"
        ? promotions
        : promotions.filter((promotion) => promotion.status === status),
    [promotions, status],
  );

  useEffect(() => {
    if (
      selectedId &&
      filteredPromotions.some((promotion) => promotion.id === selectedId)
    ) {
      return;
    }
    setSelectedId(filteredPromotions[0]?.id ?? null);
  }, [filteredPromotions, selectedId]);

  const selectedPromotion =
    promotions.find((promotion) => promotion.id === selectedId) ?? null;

  const handlePromotionChange = (updatedPromotion: Promotion) => {
    setPromotions((currentPromotions) =>
      currentPromotions.map((promotion) =>
        promotion.id === updatedPromotion.id
          ? updatedPromotion
          : promotion,
      ),
    );
    updateMockPromotion(updatedPromotion);
  };

  if (loading) {
    return (
      <main className="application-state" role="status">
        Loading PromoOps…
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="application-state application-state--error" role="alert">
        <h1>PromoOps could not start</h1>
        <p>{loadError}</p>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">
          SC
        </div>
        <div>
          <p className="eyebrow">Content management</p>
          <h1>PromoOps</h1>
        </div>
        <div className="environment-label">Training environment</div>
      </header>

      <main>
        <section className="workspace-intro" aria-labelledby="workspace-title">
          <div>
            <p className="eyebrow">Promotions</p>
            <h2 id="workspace-title">Publication workspace</h2>
            <p>
              Prepare multilingual campaign content and verify it before
              publication.
            </p>
          </div>
          <PromotionFilters value={status} onChange={setStatus} />
        </section>

        <div className="workspace-layout">
          <aside className="panel navigation-panel" aria-label="Promotion list">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Campaign library</p>
                <h2>Promotions</h2>
              </div>
              <span className="count-badge">{filteredPromotions.length}</span>
            </div>
            <PromotionList
              promotions={filteredPromotions}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </aside>

          <div className="workspace-main">
            {selectedPromotion ? (
              <>
                <PromotionEditor
                  promotion={selectedPromotion}
                  locale={locale}
                  onLocaleChange={setLocale}
                  onPromotionChange={handlePromotionChange}
                />
                <div className="side-panels">
                  <PromotionPreview
                    promotionId={selectedPromotion.id}
                    locale={locale}
                  />
                  <PublicationReadiness
                    promotion={selectedPromotion}
                    onPublish={(promotion) =>
                      window.alert(`${promotion.name} published`)
                    }
                  />
                </div>
              </>
            ) : (
              <section className="panel empty-workspace">
                <h2>No promotion selected</h2>
                <p>Choose a different publication-status filter.</p>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/promotions" element={<PromotionsWorkspace />} />
      <Route path="/" element={<Navigate replace to="/promotions" />} />
      <Route path="*" element={<Navigate replace to="/promotions" />} />
    </Routes>
  );
}
