export default function EmptyState({ icon = '🎧', title, description, action }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon" aria-hidden="true">
        {icon}
      </span>
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__text">{description}</p>}
      {action}
    </div>
  );
}