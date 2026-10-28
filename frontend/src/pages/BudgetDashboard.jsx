import { useMemo, useState } from "react";

const initialExpenses = [
  {
    id: 1,
    title: "Hotel accommodation",
    category: "Accommodation",
    amount: 18000,
    date: "2026-10-25",
    notes: "Beach villa booking",
  },
  {
    id: 2,
    title: "Train tickets",
    category: "Transport",
    amount: 2500,
    date: "2026-10-26",
    notes: "Scenic train journey",
  },
  {
    id: 3,
    title: "Lunch",
    category: "Food",
    amount: 1800,
    date: "2026-10-27",
    notes: "",
  },
];

const categories = [
  "Accommodation",
  "Transport",
  "Food",
  "Activities",
  "Shopping",
  "Other",
];

const formatLKR = (amount) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 2,
  }).format(amount);

const emptyForm = {
  title: "",
  category: "Food",
  amount: "",
  date: new Date().toLocaleDateString("en-CA"),
  notes: "",
};

export default function Budget() {
  const [budget, setBudget] = useState(100000);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [dialog, setDialog] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const totalSpent = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const remaining = budget - totalSpent;
  const spentPercent = budget > 0
    ? Math.min((totalSpent / budget) * 100, 100)
    : 0;

  const categoryTotals = useMemo(
    () =>
      categories.map((category) => ({
        name: category,
        total: expenses
          .filter((expense) => expense.category === category)
          .reduce((sum, expense) => sum + Number(expense.amount), 0),
      })),
    [expenses]
  );

  const filteredExpenses = expenses
    .filter((expense) =>
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
    setForm(emptyForm);
    setDialog("expense");
  }

  function openEditDialog(expense) {
    setEditingId(expense.id);
    setForm({
      title: expense.title,
      category: expense.category,
      amount: String(expense.amount),
      date: expense.date,
      notes: expense.notes || "",
    });
    setDialog("expense");
  }

  function saveExpense(event) {
    event.preventDefault();

    const expenseData = {
      ...form,
      title: form.title.trim(),
      amount: Number(form.amount),
      notes: form.notes.trim(),
    };

    if (!expenseData.title || expenseData.amount <= 0) return;

    if (editingId !== null) {
      setExpenses((current) =>
        current.map((expense) =>
          expense.id === editingId
            ? { ...expenseData, id: editingId }
            : expense
        )
      );
    } else {
      setExpenses((current) => [
        ...current,
        { ...expenseData, id: Date.now() },
      ]);
    }

    setDialog(null);
    setEditingId(null);
    setForm(emptyForm);
  }

  function confirmDelete() {
    setExpenses((current) =>
      current.filter((expense) => expense.id !== deletingId)
    );
    setDeletingId(null);
  }

  return (
    <main className="budget-page">
      <section className="budget-hero">
        <div>
          <span className="budget-eyebrow">YOUR TRAVEL FINANCES</span>
          <h1>Travel Budget</h1>
          <p>
            Keep your Sri Lankan adventures within budget,
            one expense at a time.
          </p>
        </div>

        <button className="budget-primary-button" onClick={openAddDialog}>
          + Add Expense
        </button>
      </section>

      <section className="budget-overview">
        <article className="budget-stat-card">
          <span>Total Budget</span>
          <h2>{formatLKR(budget)}</h2>
          <button
            className="budget-text-button"
            onClick={() => setDialog("budget")}
          >
            Edit budget
          </button>
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
              spentPercent >= 100 ? "budget-progress-danger" : ""
            }`}
            style={{ width: `${spentPercent}%` }}
          />
        </div>

        <div className="budget-progress-labels">
          <span>{formatLKR(totalSpent)} spent</span>
          <span>{formatLKR(budget)} budget</span>
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
            const percentage = totalSpent > 0
              ? (category.total / totalSpent) * 100
              : 0;

            return (
              <article className="budget-category-card" key={category.name}>
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

          <button className="budget-primary-button" onClick={openAddDialog}>
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
              <article className="budget-expense-row" key={expense.id}>
                <div className="budget-expense-icon">
                  {expense.category === "Accommodation" ? "⌂" :
                   expense.category === "Transport" ? "↗" :
                   expense.category === "Food" ? "♧" :
                   expense.category === "Activities" ? "✦" :
                   expense.category === "Shopping" ? "◇" : "•"}
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
                    onClick={() => openEditDialog(expense)}
                    aria-label={`Edit ${expense.title}`}
                    title="Edit expense"
                  >
                    Edit
                  </button>
                  <button
                    className="budget-delete-button"
                    onClick={() => setDeletingId(expense.id)}
                    aria-label={`Delete ${expense.title}`}
                    title="Delete expense"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {dialog === "expense" && (
        <div
          className="budget-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDialog(null);
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
                  {editingId !== null ? "Edit Expense" : "Add Expense"}
                </h2>
              </div>
              <button
                className="budget-modal-close"
                onClick={() => setDialog(null)}
                aria-label="Close dialog"
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
                >
                  Cancel
                </button>
                <button type="submit" className="budget-primary-button">
                  {editingId !== null ? "Save Changes" : "Save Expense"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {dialog === "budget" && (
        <div className="budget-modal-backdrop">
          <section
            className="budget-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="budget-modal-title"
          >
            <div className="budget-modal-heading">
              <div>
                <span className="budget-eyebrow">TRIP SETTINGS</span>
                <h2 id="budget-modal-title">Edit Travel Budget</h2>
              </div>
              <button
                className="budget-modal-close"
                onClick={() => setDialog(null)}
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                setBudget(Number(event.currentTarget.elements.budgetAmount.value));
                setDialog(null);
              }}
            >
              <label>
                Total budget (LKR)
                <input
                  name="budgetAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  defaultValue={budget}
                />
              </label>

              <div className="budget-modal-actions">
                <button
                  type="button"
                  className="budget-secondary-button"
                  onClick={() => setDialog(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="budget-primary-button">
                  Save Budget
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deletingId !== null && (
        <div className="budget-modal-backdrop">
          <section
            className="budget-modal budget-confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <h2 id="delete-modal-title">Delete this expense?</h2>
            <p>
              This expense will be removed from your current budget summary.
            </p>
            <div className="budget-modal-actions">
              <button
                className="budget-secondary-button"
                onClick={() => setDeletingId(null)}
              >
                Cancel
              </button>
              <button
                className="budget-danger-button"
                onClick={confirmDelete}
              >
                Delete Expense
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
