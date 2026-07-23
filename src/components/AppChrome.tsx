import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type IconName =
  | "analytics"
  | "bell"
  | "calendar"
  | "chevron"
  | "dashboard"
  | "help"
  | "promotions"
  | "search"
  | "settings";

const iconPaths: Record<IconName, ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  promotions: (
    <>
      <path d="M4 5.5h16v13H4z" />
      <path d="M4 10h16M9 5.5v13" />
      <path d="M7 3.5c1.4 0 2 2 2 2s.6-2 2-2c1 0 1.8.7 1.8 1.6S12 6.8 9 6.8 5.2 6 5.2 5.1 6 3.5 7 3.5Z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 3v4M17 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01" />
    </>
  ),
  analytics: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
      <path d="M10 21h4" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9a2.5 2.5 0 1 1 4.6 1.4c-.8 1-2.2 1.2-2.2 2.8M12 17h.01" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
};

function Icon({ name }: { name: IconName }) {
  return (
    <svg
      className="ui-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

const navigationItems: Array<{
  icon: IconName;
  label: string;
  badge?: string;
  active?: boolean;
}> = [
  { icon: "dashboard", label: "Overview" },
  { icon: "promotions", label: "Promotions", badge: "4", active: true },
  { icon: "calendar", label: "Publishing calendar" },
  { icon: "analytics", label: "Performance" },
];

export function ProductNavigation() {
  return (
    <aside className="product-navigation" aria-label="Primary navigation">
      <div className="product-brand">
        <div className="brand-mark" aria-hidden="true">
          SC
        </div>
        <div>
          <strong>PromoOps</strong>
          <span>Content suite</span>
        </div>
      </div>

      <nav>
        <p className="navigation-label">Workspace</p>
        <ul className="navigation-list">
          {navigationItems.map((item) => (
            <li key={item.label}>
              {item.active ? (
                <Link
                  className="navigation-item"
                  data-active="true"
                  to="/promotions"
                  aria-current="page"
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="navigation-badge">{item.badge}</span>
                  )}
                </Link>
              ) : (
                <span className="navigation-item navigation-item--inactive">
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="navigation-footer">
        <span className="navigation-item navigation-item--inactive">
          <Icon name="settings" />
          <span>Configuration</span>
        </span>
        <div className="environment-card">
          <span className="environment-dot" aria-hidden="true" />
          <div>
            <strong>Training</strong>
            <span>Mock services online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

interface ProductTopbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function ProductTopbar({
  searchValue,
  onSearchChange,
}: ProductTopbarProps) {
  return (
    <header className="product-topbar">
      <div className="breadcrumbs" aria-label="Breadcrumb">
        <span>Content</span>
        <Icon name="chevron" />
        <strong>Promotions</strong>
      </div>

      <label className="global-search">
        <span className="visually-hidden">Search promotions</span>
        <Icon name="search" />
        <input
          type="search"
          placeholder="Search promotions…"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <kbd>⌘ K</kbd>
      </label>

      <div className="topbar-utilities">
        <span className="utility-icon" title="Help">
          <Icon name="help" />
        </span>
        <span className="utility-icon utility-icon--notified" title="Notifications">
          <Icon name="bell" />
        </span>
        <div className="operator-profile">
          <span className="operator-avatar" aria-hidden="true">
            AM
          </span>
          <div>
            <strong>Anna Müller</strong>
            <span>Content editor</span>
          </div>
        </div>
      </div>
    </header>
  );
}
