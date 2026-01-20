import React, { useEffect, useId, useRef } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

function getFocusable(container: HTMLElement | null) {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    // Save focus and prevent background scroll
    lastFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus first focusable element or dialog
    const t = window.setTimeout(() => {
      const dialog = dialogRef.current;
      const focusables = getFocusable(dialog);
      (focusables[0] ?? dialog)?.focus();
    }, 0);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap
      if (e.key === "Tab") {
        const dialog = dialogRef.current;
        const focusables = getFocusable(dialog);
        if (focusables.length === 0) {
          e.preventDefault();
          dialog?.focus();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKeyDown);
      lastFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <div className="modal__title" id={titleId}>
            {title}
          </div>
          <button className="btn btn--ghost" onClick={onClose} aria-label="Close dialog">
            Close
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
