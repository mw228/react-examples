import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void, when: boolean) {
  useEffect(() => {
    if (!when) return;

    function onPointerDown(e: MouseEvent | TouchEvent) {
      const el = ref.current;
      if (!el) return;
      if (el.contains(e.target as Node)) return;
      handler();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [ref, handler, when]);
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(menuRef, () => setOpen(false), open);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="shell">
      <div className="navbar">
        <div className="container">
          <div className="navbar-inner">
            <Link to="/" className="brand" onClick={() => setOpen(false)}>
              <div className="brand-mark">
                MW<span>.</span>
              </div>
              <div className="brand-subtitle">React Samples</div>
            </Link>

            {/* Desktop nav */}
            <div className="nav-links">
              <NavLink to="/" end className={({ isActive }) => `navlink ${isActive ? "is-active" : ""}`}>
                Home
              </NavLink>
              <NavLink to="/demos" className={({ isActive }) => `navlink ${isActive ? "is-active" : ""}`}>
                Demos
              </NavLink>
              <a className="pill" href="https://github.com/mw228" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>

            {/* Mobile menu */}
            <div className="menu" ref={menuRef}>
              <button
                type="button"
                className="menu-btn"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
              >
                <span className="menu-icon" aria-hidden="true" />
              </button>

              {open && (
                <div className="menu-panel" role="menu">
                  <NavLink
                    to="/"
                    end
                    role="menuitem"
                    className={({ isActive }) => `menu-item ${isActive ? "is-active" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to="/demos"
                    role="menuitem"
                    className={({ isActive }) => `menu-item ${isActive ? "is-active" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    Demos
                  </NavLink>

                  <div className="menu-sep" />

                  <a
                    role="menuitem"
                    className="menu-item"
                    href="https://github.com/mw228"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                  >
                    GitHub
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="main">{children}</main>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div>© {new Date().getFullYear()} Matthew Wilson</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
