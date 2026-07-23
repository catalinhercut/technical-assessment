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
import {
  ProductNavigation,
  ProductTopbar,
} from "./components/AppChrome";
import { WorkspaceSummary } from "./components/WorkspaceSummary";
import { localeLabels, statusLabels } from "./models/promotion";
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
  const [searchQuery, setSearchQuery] = useState("");
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
    () => {
      const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

      return promotions.filter((promotion) => {
        const matchesStatus =
          status === "all" || promotion.status === status;
        const matchesQuery =
          !normalizedQuery ||
          promotion.name.toLocaleLowerCase().includes(normalizedQuery) ||
          promotion.markets.some((market) =>
            market.toLocaleLowerCase().includes(normalizedQuery),
          );

        return matchesStatus && matchesQuery;
      });
    },
    [promotions, searchQuery, status],
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
    <div className="product-shell">
      <ProductNavigation />

      <div className="product-surface">
        <ProductTopbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="app-shell">
          <section className="workspace-intro" aria-labelledby="workspace-title">
            <div>
              <div className="title-line">
                <p className="eyebrow">Campaign operations</p>
                <span className="service-status">
                  <span aria-hidden="true" />
                  Services healthy
                </span>
              </div>
              <h1 id="workspace-title">Publication workspace</h1>
              <p>
                Prepare multilingual campaign content, coordinate markets, and
                verify every promotion before publication.
              </p>
            </div>
            <div className="workspace-controls">
              <span className="sync-note">Last synchronized 2 minutes ago</span>
              <PromotionFilters value={status} onChange={setStatus} />
            </div>
          </section>

          <WorkspaceSummary promotions={promotions} />

          <div className="workspace-layout">
            <aside className="panel navigation-panel" aria-label="Promotion list">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Campaign library</p>
                  <h2>Promotions</h2>
                </div>
                <span className="count-badge">{filteredPromotions.length}</span>
              </div>
              <div className="list-meta">
                <span>{filteredPromotions.length} records</span>
                <span>Updated today</span>
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
                  <section
                    className="record-context"
                    aria-label="Selected promotion summary"
                  >
                    <div className="record-context__identity">
                      <span className="record-context__icon" aria-hidden="true">
                        {selectedPromotion.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <span>Active record</span>
                        <strong>{selectedPromotion.name}</strong>
                      </div>
                    </div>
                    <dl className="record-metadata">
                      <div>
                        <dt>Status</dt>
                        <dd>
                          <span
                            className={`status-badge status-badge--${selectedPromotion.status}`}
                          >
                            {statusLabels[selectedPromotion.status]}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt>Markets</dt>
                        <dd>{selectedPromotion.markets.length}</dd>
                      </div>
                      <div>
                        <dt>Translation</dt>
                        <dd>{localeLabels[locale]}</dd>
                      </div>
                      <div>
                        <dt>Campaign window</dt>
                        <dd>
                          {selectedPromotion.startAt.slice(0, 10)} —{" "}
                          {selectedPromotion.endAt.slice(0, 10)}
                        </dd>
                      </div>
                    </dl>
                    <span className="editing-presence">
                      <span className="operator-avatar operator-avatar--small">
                        AM
                      </span>
                      You are editing
                    </span>
                  </section>

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
                  <p>Adjust the search or publication-status filter.</p>
                </section>
              )}
            </div>
          </div>
        </main>
      </div>
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
