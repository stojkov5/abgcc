import Link from "next/link";
import { ArrowRight } from "lucide-react";
import "@/styles/admin-ui.css";

export function AdminPageHeader({
  eyebrow = "Admin Panel",
  title,
  text,
  action,
}) {
  return (
    <div className="admin-ui-page-header">
      <div>
        {eyebrow && <p className="admin-ui-eyebrow">{eyebrow}</p>}
        {title && <h1 className="admin-ui-title">{title}</h1>}
        {text && <p className="admin-ui-text">{text}</p>}
      </div>

      {action && <div className="admin-ui-header-action">{action}</div>}
    </div>
  );
}

export function AdminPanel({ title, action, children, className = "" }) {
  return (
    <section className={`admin-ui-panel ${className}`}>
      {(title || action) && (
        <div className="admin-ui-panel-header">
          {title && <h2>{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}

      {children}
    </section>
  );
}

export function AdminStatCard({ label, value, text }) {
  return (
    <article className="admin-ui-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {text && <p>{text}</p>}
    </article>
  );
}

export function AdminActionCard({ href, icon: Icon, title, text }) {
  return (
    <Link href={href} className="admin-ui-action-card">
      {Icon && (
        <span className="admin-ui-action-icon">
          <Icon size={20} />
        </span>
      )}

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>

      <span className="admin-ui-action-link">
        Open <ArrowRight size={14} />
      </span>
    </Link>
  );
}

export function AdminEmptyState({ text = "No data found." }) {
  return <p className="admin-ui-empty">{text}</p>;
}

export function AdminStatus({ children, variant = "neutral" }) {
  return (
    <span className={`admin-ui-status ${variant}`}>
      {children}
    </span>
  );
}