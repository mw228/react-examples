import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";

type User = { id: number; name: string; email: string };
type Todo = { userId: number; id: number; title: string; completed: boolean };

type SortKey = "title" | "owner" | "status";
type SortDir = "asc" | "desc";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function useQueryState() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  function get(key: string, fallback = "") {
    return params.get(key) ?? fallback;
  }

  function set(next: Record<string, string>) {
    const p = new URLSearchParams(location.search);
    Object.entries(next).forEach(([k, v]) => {
      if (!v) p.delete(k);
      else p.set(k, v);
    });
    navigate({ pathname: location.pathname, search: p.toString() }, { replace: true });
  }

  return { get, set };
}

export default function DashboardDemo() {
  const qs = useQueryState();

  // URL-backed state
  const [q, setQ] = useState(() => qs.get("q", ""));
  const [status, setStatus] = useState<"all" | "active" | "done">(
    () => (qs.get("status", "all") as any) ?? "all"
  );
  const [sortKey, setSortKey] = useState<SortKey>(() => (qs.get("sort", "title") as SortKey) ?? "title");
  const [sortDir, setSortDir] = useState<SortDir>(() => (qs.get("dir", "asc") as SortDir) ?? "asc");
  const [page, setPage] = useState(() => Number(qs.get("page", "1")) || 1);

  const pageSize = 10;

  // Data state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [usersById, setUsersById] = useState<Record<number, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep URL in sync (debounced-ish)
  useEffect(() => {
    const t = window.setTimeout(() => {
      qs.set({
        q: q.trim(),
        status,
        sort: sortKey,
        dir: sortDir,
        page: String(page),
      });
    }, 150);
    return () => window.clearTimeout(t);
  }, [q, status, sortKey, sortDir, page]);

  // Fetch data (JSONPlaceholder)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [todosRes, usersRes] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/todos"),
          fetch("https://jsonplaceholder.typicode.com/users"),
        ]);

        if (!todosRes.ok) throw new Error(`Todos request failed (${todosRes.status})`);
        if (!usersRes.ok) throw new Error(`Users request failed (${usersRes.status})`);

        const todosData = (await todosRes.json()) as Todo[];
        const usersData = (await usersRes.json()) as User[];

        const map: Record<number, User> = {};
        usersData.forEach((u) => (map[u.id] = u));

        if (!cancelled) {
          setTodos(todosData.slice(0, 90)); // keep it snappy
          setUsersById(map);
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message || "Failed to load dashboard data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return todos.filter((t) => {
      const owner = usersById[t.userId]?.name?.toLowerCase() ?? "";

      const matchesQuery = !query || t.title.toLowerCase().includes(query) || owner.includes(query);

      const matchesStatus = status === "all" ? true : status === "done" ? t.completed : !t.completed;

      return matchesQuery && matchesStatus;
    });
  }, [todos, usersById, q, status]);

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;

    const ownerName = (t: Todo) => (usersById[t.userId]?.name ?? "").toLowerCase();
    const statusNum = (t: Todo) => (t.completed ? 1 : 0);

    const copy = [...filtered];
    copy.sort((a, b) => {
      if (sortKey === "title") return a.title.localeCompare(b.title) * dir;
      if (sortKey === "owner") return ownerName(a).localeCompare(ownerName(b)) * dir;
      return (statusNum(a) - statusNum(b)) * dir;
    });
    return copy;
  }, [filtered, sortKey, sortDir, usersById]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = clamp(page, 1, totalPages);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [safePage]);

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, safePage]);

  function toggleSort(nextKey: SortKey) {
    if (sortKey === nextKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(nextKey);
      setSortDir("asc");
    }
    setPage(1);
  }

  return (
    <div>
      <h2 className="page-title">Dashboard Demo</h2>
      <p className="page-subtitle">
        Fetch + normalize data, then filter/search, sort, and paginate with URL-synced state for shareable views.
      </p>

      <div className="dashboard-layout">
        <Card title="Controls" description="Search and filters update the table and persist in the URL.">
          <div className="dash-controls">
            <div className="dash-field">
              <label className="label" htmlFor="dash-search">
                Search
              </label>
              <input
                id="dash-search"
                className="input"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Search title or owner (e.g. Leanne)"
              />
            </div>

            <div className="dash-field">
              <label className="label" htmlFor="dash-status">
                Status
              </label>
              <select
                id="dash-status"
                className="select"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as any);
                  setPage(1);
                }}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="dash-actions">
              <Button
                variant="ghost"
                onClick={() => {
                  setQ("");
                  setStatus("all");
                  setSortKey("title");
                  setSortDir("asc");
                  setPage(1);
                }}
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="dash-meta">
            Showing <strong>{sorted.length}</strong> results
          </div>
        </Card>

        <Card title="Table" description="Sortable columns with keyboard-friendly controls and a11y markup.">
          {loading && (
            <div role="status" aria-live="polite" className="dash-note">
              Loading dashboard data…
            </div>
          )}

          {error && (
            <div role="alert" className="dash-note">
              {error}
            </div>
          )}

          {!loading && !error && sorted.length === 0 && (
            <div role="status" aria-live="polite" className="dash-note">
              No results match your filters.
            </div>
          )}

          {!loading && !error && sorted.length > 0 && (
            <>
              <div className="table-wrap" role="region" aria-label="Dashboard table">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">
                        <button type="button" className="th-btn" onClick={() => toggleSort("title")}>
                          Title {sortKey === "title" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                        </button>
                      </th>
                      <th scope="col">
                        <button type="button" className="th-btn" onClick={() => toggleSort("owner")}>
                          Owner {sortKey === "owner" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                        </button>
                      </th>
                      <th scope="col">
                        <button type="button" className="th-btn" onClick={() => toggleSort("status")}>
                          Status {sortKey === "status" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                        </button>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {pageRows.map((t) => {
                      const owner = usersById[t.userId]?.name ?? `User ${t.userId}`;
                      return (
                        <tr key={t.id}>
                          <td className="td-title">{t.title}</td>
                          <td>{owner}</td>
                          <td>
                            <span className={`badge ${t.completed ? "badge--ok" : "badge--warn"}`}>
                              {t.completed ? "Done" : "Active"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="pager" aria-label="Pagination">
                <Button variant="ghost" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Prev
                </Button>
                <div className="dash-note">
                  Page <strong>{safePage}</strong> of <strong>{totalPages}</strong>
                </div>
                <Button
                  variant="ghost"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </Card>

        <Card title="What this demonstrates" description="Common product dashboard patterns.">
          <ul className="card-desc" style={{ margin: 0, paddingLeft: "1.1rem" }}>
            <li>Fetch + normalize data (users map by id)</li>
            <li>Search + filter + sort with memoized derived state</li>
            <li>Pagination with clamped page safety</li>
            <li>URL-backed UI state (shareable view)</li>
            <li>Accessible table region + keyboard-friendly sorting</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
