import React from "react";

export function Card({
  title,
  description,
  children,
  className = "",
}: React.PropsWithChildren<{ title?: string; description?: string; className?: string }>) {
  return (
    <div className={`ui-card ${className}`.trim()}>
      {(title || description) && (
        <div className="ui-card__header">
          {title && <div className="ui-card__title">{title}</div>}
          {description && <div className="ui-card__desc">{description}</div>}
        </div>
      )}
      {children && <div className="ui-card__body">{children}</div>}
    </div>
  );
}
