import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api";

const categories = [
  "Accommodation",
  "Transport",
  "Food",
  "Activities",
  "Shopping",
  "Other",
];

const emptyForm = {
  title: "",
  category: "Food",
  amount: "",
  date: new Date().toLocaleDateString("en-CA"),
  notes: "",
};

const formatLKR = (amount) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

function mapExpense(expense) {
  return {
    id: expense._id,
    title: expense.title,
    category: expense.category,
    amount: Number(expense.amount),
    date: String(expense.expenseDate).slice(0, 10),
    notes: expense.notes || "",
  };
}

export default function Budget() {
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);

  const [loadingTrips, setLoadingTrips] = useState(true);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [dialog, setDialog] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const apiRequest = useCallback(async (path, options = {}) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please log in to manage your travel expenses.");
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || `Request failed (${response.status}).`
      );
    }

    return data;
  }, []);

  // Load the user's trips.
  useEffect(() => {
    let cancelled = false;

    async function loadTrips() {
      setLoadingTrips(true);
      setError("");

      try {
        const data = await apiRequest("/trips/my-trips");

        if (cancelled) return;

        const userTrips = data.trips || [];
        setTrips(userTrips);

        setSelectedTripId((current) => {
          if (current && userTrips.some((trip) => trip._id === current)) {
            return current;
          }

          return userTrips[0]?._id || "";
        });
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load your trips.");
        }
      } finally {
        if (!cancelled) setLoadingTrips(false);
      }
    }

    loadTrips();

    return () => {
      cancelled = true;
    };
  }, [apiRequest]);

  // Load expenses whenever the selected trip changes.
  const loadExpenses = useCallback(async () => {
    if (!selectedTripId) {
      setExpenses([]);
      setBudget(null);
      return;
    }

    setLoadingExpenses(true);
    setError("");

    try {
      const data = await apiRequest(
        `/expenses/${selectedTripId}`
      );

      setExpenses((data.expenses || []).map(mapExpense));
      setBudget(data.budget || null);
    } catch (err) {
      setExpenses([]);
      setBudget(null);
      setError(err.message || "Could not load expenses.");
    } finally {
      setLoadingExpenses(false);
    }
  }, [apiRequest, selectedTripId]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const totalSpent = Number(budget?.totalExpenses ?? 0);
  const totalBudget = Number(budget?.totalBudget ?? 0);
  const remaining = Number(
    budget?.remainingBudget ?? totalBudget - totalSpent
  );

  const spentPercent =
    totalBudget > 0
      ? Math.min((totalSpent / totalBudget) * 100, 100)
      : 0;

  const categoryTotals = useMemo(
    () =>
      categories.map((category) => ({
        name: category,
        total: expenses
          .filter((expense) => expense.category === category)
          .reduce((sum, expense) => sum + expense.amount, 0),
      })),
    [expenses]
  );

  const filteredExpenses = expenses
    .filter(
      (expense) =>
        filter === "All" || expense.category === filter
    )
    .filter((expense) =>
      `${expense.title} ${expense.category} ${expense.notes}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  function openAddDialog() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setDialog("expense");
  }

  function openEditDialog(expense) {
    setEditingId(expense.id);
    setForm({
      title: expense.title,
      category: expense.category,
      amount: String(expense.amount),
      date: expense.date,
      notes: expense.notes,
    });
    setError("");
    setDialog("expense");
  }

  async function saveExpense(event) {
    event.preventDefault();
    setError("");

    const amount = Number(form.amount);
    const title = form.title.trim();

    if (!selectedTripId) {
      setError("Please select a trip first.");
      return;
    }

    if (!title || !Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid expense name and amount.");
      return;
    }

    if (!form.date) {
      setError("Please select an expense date.");
      return;
    }

    const payload = {
      title,
      category: form.category,
      amount,
      expenseDate: form.date,
      notes: form.notes.trim(),
    };

    setSaving(true);

    try {
      if (editingId) {
        await apiRequest(
          `/expenses/${selectedTripId}/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
      } else {
        await apiRequest(`/expenses/${selectedTripId}`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setDialog(null);
      setEditingId(null);
      setForm({ ...emptyForm });

      await loadExpenses();
    } catch (err) {
      setError(err.message || "Could not save the expense.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!selectedTripId || !deletingId) return;

    setSaving(true);
    setError("");

    try {
      await apiRequest(
        `/expenses/${selectedTripId}/${deletingId}`,
        { method: "DELETE" }
      );

      setDeletingId(null);
      await loadExpenses();
    } catch (err) {
      setError(err.message || "Could not delete the expense.");
    } finally {
      setSaving(false);
    }
  }

  const selectedTrip = trips.find(
    (trip) => trip._id === selectedTripId
  );

  return (
    <main className="budget-page">
      <section className="budget-hero">
        <div>
          <span className="budget-eyebrow">
            YOUR TRAVEL FINANCES
          </span>
          <h1>Travel Budget</h1>
          <p>
            Keep your Sri Lankan adventures within budget,
            one expense at a time.
          </p>
        </div>

        <button
          type="button"
          className="budget-primary-button"
          onClick={openAddDialog}
          disabled={!selectedTripId || loadingExpenses}
        >
          + Add Expense
        </button>
      </section>

      {error && (
        <div className="budget-empty-state" role="alert">
          <p>{error}</p>
          <button
            type="button"
            className="budget-secondary-button"
            onClick={() => setError("")}
          >
            Dismiss
          </button>
        </div>
      )}

      {loadingTrips ? (
        <section className="budget-panel">
          <p>Loading your trips...</p>
        </section>
      ) : trips.length === 0 ? (
        <section className="budget-panel">
          <h2>No trips available</h2>
          <p>Create a trip in My Trips before recording expenses.</p>
        </section>
      ) : (
        <>
          <section className="budget-panel">
            <div className="budget-panel-heading">
              <div>
                <h2>Select your trip</h2>
                <p>Expenses and budget totals are trip-specific.</p>
              </div>
            </div>

            <label>
              Your trip
              <select
                value={selectedTripId}
                onChange={(event) => {
                  setSelectedTripId(event.target.value);
                  setFilter("All");
                  setSearch("");
                }}
                disabled={saving}
              >
                {trips.map((trip) => (
                  <option key={trip._id} value={trip._id}>
                    {trip.tripName}
                  </option>
                ))}
              </select>
            </label>
          </section>

          {loadingExpenses ? (
            <section className="budget-panel">
              <p>Loading expenses...</p>
            </section>
          ) : (
            <>
              <section className="budget-overview">
                <article className="budget-stat-card">
                  <span>Total Budget</span>
                  <h2>{formatLKR(totalBudget)}</h2>
                  <p>{selectedTrip?.tripName}</p>
                </article>

                <article className="budget-stat-card">
                  <span>Total Spent</span>
                  <h2>{formatLKR(totalSpent)}</h2>
                  <p>Across {expenses.length} expenses</p>
                </article>

                <article className="budget-stat-card">
                  <span>Remaining Balance</span>
                  <h2 className={remaining < 0 ? "budget-over" : ""}>
                    {formatLKR(remaining)}
                  </h2>
                  <p>
                    {remaining < 0
                      ? "You have exceeded your budget."
                      : "Available for your trip"}
                  </p>
                </article>
              </section>

              <section className="budget-panel">
                <div className="budget-panel-heading">
                  <div>
                    <h2>Budget Progress</h2>
                    <p>Track your spending against your travel budget.</p>
                  </div>
                  <strong>{spentPercent.toFixed(1)}%</strong>
                </div>

                <div className="budget-progress-track">
                  <div
                    className={`budget-progress-fill ${
                      spentPercent >= 100
                        ? "budget-progress-danger"
                        : ""
                    }`}
                    style={{ width: `${spentPercent}%` }}
                  />
                </div>

                <div className="budget-progress-labels">
                  <span>{formatLKR(totalSpent)} spent</span>
                  <span>{formatLKR(totalBudget)} budget</span>
                </div>
              </section>

              <section className="budget-panel">
                <div className="budget-panel-heading">
                  <div>
                    <h2>Spending by Category</h2>
                    <p>See where your travel money goes.</p>
                  </div>
                </div>

                <div className="budget-category-grid">
                  {categoryTotals.map((category) => {
                    const percentage =
                      totalSpent > 0
                        ? (category.total / totalSpent) * 100
                        : 0;

                    return (
                      <article
                        className="budget-category-card"
                        key={category.name}
                      >
                        <span>{category.name}</span>
                        <h3>{formatLKR(category.total)}</h3>
                        <div className="budget-category-track">
                          <div
                            className="budget-category-fill"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <small>{percentage.toFixed(1)}% of spending</small>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="budget-panel">
                <div className="budget-panel-heading budget-expenses-heading">
                  <div>
                    <h2>Recent Expenses</h2>
                    <p>Manage the costs recorded for your trip.</p>
                  </div>

                  <button
                    type="button"
                    className="budget-primary-button"
                    onClick={openAddDialog}
                  >
                    + Add Expense
                  </button>
                </div>

                <div className="budget-filters">
                  <input
                    type="search"
                    placeholder="Search expenses..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search expenses"
                  />

                  <select
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    aria-label="Filter by category"
                  >
                    <option value="All">All categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {filteredExpenses.length === 0 ? (
                  <div className="budget-empty-state">
                    <h3>No expenses found</h3>
                    <p>Add an expense or change your search filters.</p>
                  </div>
                ) : (
                  <div className="budget-expense-list">
                    {filteredExpenses.map((expense) => (
                      <article
                        className="budget-expense-row"
                        key={expense.id}
                      >
                        <div className="budget-expense-icon">
                          {expense.category === "Accommodation"
                            ? "⌂"
                            : expense.category === "Transport"
                            ? "↗"
                            : expense.category === "Food"
                            ? "♧"
                            : expense.category === "Activities"
                            ? "✦"
                            : expense.category === "Shopping"
                            ? "◇"
                            : "•"}
                        </div>

                        <div className="budget-expense-info">
                          <h3>{expense.title}</h3>
                          <p>
                            {expense.category} · {expense.date}
                          </p>
                          {expense.notes && <small>{expense.notes}</small>}
                        </div>

                        <strong className="budget-expense-amount">
                          {formatLKR(expense.amount)}
                        </strong>

                        <div className="budget-expense-actions">
                          <button
                            type="button"
                            onClick={() => openEditDialog(expense)}
                            disabled={saving}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="budget-delete-button"
                            onClick={() => setDeletingId(expense.id)}
                            disabled={saving}
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </>
      )}

      {dialog === "expense" && (
        <div
          className="budget-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setDialog(null);
            }
          }}
        >
          <section
            className="budget-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="expense-modal-title"
          >
            <div className="budget-modal-heading">
              <div>
                <span className="budget-eyebrow">TRIP EXPENSE</span>
                <h2 id="expense-modal-title">
                  {editingId ? "Edit Expense" : "Add Expense"}
                </h2>
              </div>
              <button
                type="button"
                className="budget-modal-close"
                onClick={() => !saving && setDialog(null)}
                aria-label="Close dialog"
                disabled={saving}
              >
                ×
              </button>
            </div>

            <form onSubmit={saveExpense}>
              <label>
                Expense name
                <input
                  required
                  maxLength={100}
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="e.g. Train tickets"
                />
              </label>

              <div className="budget-form-row">
                <label>
                  Amount (LKR)
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) =>
                      setForm({ ...form, amount: event.target.value })
                    }
                    placeholder="2500"
                  />
                </label>

                <label>
                  Category
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                Expense date
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(event) =>
                    setForm({ ...form, date: event.target.value })
                  }
                />
              </label>

              <label>
                Notes (optional)
                <textarea
                  rows="3"
                  maxLength={500}
                  value={form.notes}
                  onChange={(event) =>
                    setForm({ ...form, notes: event.target.value })
                  }
                  placeholder="Add extra details..."
                />
              </label>

              <div className="budget-modal-actions">
                <button
                  type="button"
                  className="budget-secondary-button"
                  onClick={() => setDialog(null)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="budget-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Save Expense"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deletingId && (
        <div className="budget-modal-backdrop">
          <section
            className="budget-modal budget-confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <h2 id="delete-modal-title">Delete this expense?</h2>
            <p>This expense will be removed from your trip budget.</p>

            <div className="budget-modal-actions">
              <button
                type="button"
                className="budget-secondary-button"
                onClick={() => setDeletingId(null)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="budget-danger-button"
                onClick={confirmDelete}
                disabled={saving}
              >
                {saving ? "Deleting..." : "Delete Expense"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}