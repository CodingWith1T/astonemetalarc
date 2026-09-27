"use client";

import { useEffect, type ReactNode } from "react";

/* ------------------------------ Icons ------------------------------ */

type IconProps = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconWallet = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a2 2 0 0 1 2 2v1" />
    <path d="M3 7.5V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2.5" />
    <path d="M21 9.5v3.5h-4a1.75 1.75 0 0 1 0-3.5z" />
  </svg>
);

export const IconReceipt = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M5 3.5v17l2.2-1.4 2.3 1.4 2.3-1.4 2.3 1.4L16.3 19 19 20.5v-17z" />
    <path d="M8.5 8h7M8.5 11.5h7M8.5 15h4" />
  </svg>
);

export const IconScale = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 4v16" />
    <path d="M6 8h12" />
    <path d="M6 8 3 15h6z" />
    <path d="M18 8l-3 7h6z" />
    <path d="M8 20h8" />
  </svg>
);

export const IconClock = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </svg>
);

export const IconCash = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M6 9.5v5M18 9.5v5" />
  </svg>
);

export const IconClipboard = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="5" y="4.5" width="14" height="16" rx="2" />
    <path d="M9 4.5V3h6v1.5" />
    <path d="M9 10h6M9 14h4" />
  </svg>
);

export const IconCheck = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.5 12.2l2.4 2.4 4.6-4.9" />
  </svg>
);

export const IconStore = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 9.5V20h16V9.5" />
    <path d="M3 9.5 4.8 4h14.4L21 9.5z" />
    <path d="M9 20v-5.5h6V20" />
  </svg>
);

export const IconBox = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3 3.5 7.2v9.6L12 21l8.5-4.2V7.2z" />
    <path d="M3.5 7.2 12 11.5l8.5-4.3" />
    <path d="M12 11.5V21" />
  </svg>
);

export const IconChart = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 20V4" />
    <path d="M4 20h16" />
    <path d="M8 20v-6M12.5 20V9M17 20v-9" />
  </svg>
);

export const IconTeam = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6" />
    <path d="M17.5 14.6a5.5 5.5 0 0 1 3 4.9" />
  </svg>
);

export const IconBuilding = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 20V5.5L13 3v17" />
    <path d="M13 9.5h7V20" />
    <path d="M7 8h3M7 11.5h3M7 15h3M16 12.5h1.5M16 16h1.5" />
  </svg>
);

export const IconCalendar = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </svg>
);

export const IconArrowUp = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 19V6" />
    <path d="M6 11.5 12 5.5l6 6" />
  </svg>
);

export const IconArrowDown = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 5v13" />
    <path d="M6 12.5 12 18.5l6-6" />
  </svg>
);

export const IconPlus = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconSearch = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4 4" />
  </svg>
);

export const IconDownload = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3.5v11" />
    <path d="M7.5 10.5 12 15l4.5-4.5" />
    <path d="M4.5 19.5h15" />
  </svg>
);

export const IconPrint = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M7 9V4h10v5" />
    <path d="M5 9h14a2 2 0 0 1 2 2v5h-4" />
    <path d="M7 16H3v-5a2 2 0 0 1 2-2" />
    <rect x="7" y="13.5" width="10" height="6.5" rx="1" />
  </svg>
);

export const IconFilter = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M3.5 5.5h17l-6.5 7.5v6l-4 2v-8z" />
  </svg>
);

export const IconChevron = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M9 5.5 15.5 12 9 18.5" />
  </svg>
);

export const IconClose = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconEdit = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 20h4l10-10-4-4L4 16z" />
    <path d="M14 6l4 4" />
  </svg>
);

export const IconTrash = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />
  </svg>
);

export const IconHistory = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
    <path d="M3.5 4.5V9H8" />
    <path d="M12 8v4.5l3 1.8" />
  </svg>
);

export const IconShield = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3 5 5.8v5.4c0 4.3 2.9 8.2 7 9.8 4.1-1.6 7-5.5 7-9.8V5.8z" />
    <path d="M9 12.2l2.2 2.2 4-4.3" />
  </svg>
);

export const IconFile = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M6 3.5h7l5 5v12H6z" />
    <path d="M13 3.5v5h5" />
  </svg>
);

export const IconMenu = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconLocation = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const IconRefresh = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M20 12a8 8 0 1 1-2.6-5.9" />
    <path d="M20 4.5V10h-5.5" />
  </svg>
);

/* ------------------------------ Status ------------------------------ */

const STATUS_CLASS: Record<string, string> = {
  draft: "draft",
  submitted: "submitted",
  "pending approval": "pending",
  approved: "approved",
  rejected: "rejected",
  paid: "paid",
  purchased: "purchased",
  completed: "completed",
  active: "active",
  assigned: "assigned",
  "in storage": "storage",
  maintenance: "maintenance",
  lost: "lost",
  disposed: "disposed",
  credited: "approved",
  low: "draft",
  normal: "submitted",
  high: "pending",
  urgent: "rejected",
};

export function StatusBadge({ status, dot = true }: { status: string; dot?: boolean }) {
  const key = STATUS_CLASS[status.toLowerCase()] ?? "draft";
  return (
    <span className={`of-badge of-badge-${key}`}>
      {dot && <span className="of-badge-dot" />}
      {status}
    </span>
  );
}

/* ------------------------------ Modal ------------------------------ */

export function Modal({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
  width = 720,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="of-overlay" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className="of-modal" style={{ maxWidth: width }} onMouseDown={(e) => e.stopPropagation()}>
        <header className="of-modal-head">
          <div>
            <h3>{title}</h3>
            {subtitle && <p className="of-modal-sub">{subtitle}</p>}
          </div>
          <button className="of-icon-btn" onClick={onClose} aria-label="Close">
            <IconClose />
          </button>
        </header>
        <div className="of-modal-body">{children}</div>
        {footer && <footer className="of-modal-foot">{footer}</footer>}
      </div>
    </div>
  );
}

/* ------------------------------ Drawer ------------------------------ */

export function Drawer({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="of-drawer-overlay" onMouseDown={onClose} role="dialog" aria-modal="true">
      <aside className="of-drawer" onMouseDown={(e) => e.stopPropagation()}>
        <header className="of-drawer-head">
          <div>
            <h3>{title}</h3>
            {subtitle && <p className="of-drawer-sub">{subtitle}</p>}
          </div>
          <button className="of-icon-btn" onClick={onClose} aria-label="Close drawer">
            <IconClose />
          </button>
        </header>
        <div className="of-drawer-body">{children}</div>
        {footer && <footer className="of-drawer-foot">{footer}</footer>}
      </aside>
    </div>
  );
}

/* ------------------------------ Confirm ------------------------------ */

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  tone,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  tone: "primary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal open={open} title={title} onClose={onCancel} width={460}>
      <div className="of-confirm">
        <div className={`of-confirm-icon of-confirm-icon-${tone}`}>
          {tone === "danger" ? <IconTrash size={22} /> : <IconCheck size={22} />}
        </div>
        <p>{message}</p>
      </div>
      <div className="of-confirm-actions">
        <button className="of-btn of-btn-ghost" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button className={`of-btn ${tone === "danger" ? "of-btn-danger" : "of-btn-primary"}`} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

/* ------------------------------ Empty ------------------------------ */

export function EmptyState({
  title,
  message,
  action,
  icon,
}: {
  title: string;
  message: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="of-empty">
      <div className="of-empty-icon">{icon ?? <IconClipboard size={26} />}</div>
      <h4>{title}</h4>
      <p>{message}</p>
      {action}
    </div>
  );
}

/* ------------------------------ Skeleton ------------------------------ */

export function SkeletonRows({ rows = 6, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="of-skeleton-row">
          {Array.from({ length: cols }).map((__, c) => (
            <td key={c}>
              <span className="of-skeleton" style={{ width: `${45 + ((r * 7 + c * 13) % 40)}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

/* ------------------------------ Pagination ------------------------------ */

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPage,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
}) {
  if (total === 0) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="of-pagination">
      <span className="of-pagination-info">
        Showing <strong>{start}</strong>–<strong>{end}</strong> of <strong>{total}</strong>
      </span>
      <div className="of-pagination-controls">
        <button className="of-page-btn" disabled={page === 1} onClick={() => onPage(page - 1)}>
          Previous
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`of-page-btn of-page-num${p === page ? " active" : ""}`}
            onClick={() => onPage(p)}
          >
            {p}
          </button>
        ))}
        <button className="of-page-btn" disabled={page === pageCount} onClick={() => onPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ Detail rows ------------------------------ */

export function DetailRow({ label, value, tone }: { label: string; value: ReactNode; tone?: string }) {
  return (
    <div className="of-detail-row">
      <span className="of-detail-label">{label}</span>
      <span className={`of-detail-value${tone ? ` of-tone-${tone}` : ""}`}>{value}</span>
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="of-section-title">
      <h3>{children}</h3>
      {action}
    </div>
  );
}
