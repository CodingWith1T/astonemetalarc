"use client";

import { Drawer, IconCheck, IconClose, IconFile, IconHistory } from "@/app/admin/_lib/finance/ui";
import { useSiteFinance } from "../_lib/SiteFinanceContext";
import { formatDate, formatMoney } from "@/app/admin/_lib/finance/format";
import { COST_GROUPS } from "@/app/admin/_lib/finance/sites-data";

const GROUP_COLOUR: Record<string, string> = {
  Labour: "blue",
  Material: "orange",
  Subcontractor: "purple",
  Machinery: "green",
  "Equipment Hire": "teal",
  "Site Overheads": "slate",
  "Professional Fees": "amber",
};

export default function ExpenseDrawer({
  expenseId,
  onClose,
}: {
  expenseId: string | null;
  onClose: () => void;
}) {
  const { allExpenses, projects, site, setExpenseStatus, pushToast, setConfirm } = useSiteFinance();

  const expense = allExpenses.find((e) => e.id === expenseId);

  if (!expense) return null;

  const project = projects.find((p) => p.id === expense.projectId);

  const approve = () => setExpenseStatus(expense.id, "Approved", site.siteManager);

  const reject = () =>
    setConfirm({
      title: "Reject this expense?",
      message: `${expense.head} — ${formatMoney(expense.amount, expense.currency)} will be marked rejected and excluded from approved cost.`,
      confirmLabel: "Reject expense",
      tone: "danger",
      onConfirm: () => setExpenseStatus(expense.id, "Rejected", site.siteManager),
    });

  return (
    <Drawer
      open
      title="Expense Detail"
      subtitle={`${expense.id.toUpperCase()} · ${formatDate(expense.date)}`}
      onClose={onClose}
      footer={
        expense.status === "Pending Approval" ? (
          <>
            <button className="fin-btn fin-btn-ghost" onClick={reject}>
              Reject
            </button>
            <button className="fin-btn fin-btn-primary" onClick={approve}>
              <IconCheck size={16} /> Approve expense
            </button>
          </>
        ) : (
          <button className="fin-btn fin-btn-ghost" onClick={onClose}>
            Close
          </button>
        )
      }
    >
      <div className="fin-drawer-block">
        <div className="fin-drawer-amount">
          <span>Amount</span>
          <strong>{formatMoney(expense.amount, expense.currency)}</strong>
        </div>
        <div className="fin-chip-row">
          <span className={`fin-chip fin-chip-${GROUP_COLOUR[expense.group] ?? "slate"}`}>
            {expense.group}
          </span>
          <span className={`fin-chip fin-chip-${expense.status === "Approved" ? "green" : expense.status === "Rejected" ? "red" : "amber"}`}>
            {expense.status}
          </span>
        </div>
      </div>

      <dl className="fin-detail-list">
        <div>
          <dt>Cost head</dt>
          <dd>{expense.head}</dd>
        </div>
        <div>
          <dt>Description</dt>
          <dd>{expense.description}</dd>
        </div>
        <div>
          <dt>Project</dt>
          <dd>
            {project ? `${project.code} — ${project.name}` : expense.projectId}
          </dd>
        </div>
        <div>
          <dt>Paid to</dt>
          <dd>{expense.paidTo}</dd>
        </div>
        <div>
          <dt>Payment mode</dt>
          <dd>{expense.paymentMethod}</dd>
        </div>
        <div>
          <dt>Paid by</dt>
          <dd>{expense.paidBy}</dd>
        </div>
        <div>
          <dt>Bill / receipt no.</dt>
          <dd>{expense.receiptNo ?? "—"}</dd>
        </div>
        {expense.approvedBy && (
          <div>
            <dt>Approved by</dt>
            <dd>
              {expense.approvedBy}
              {expense.approvedOn ? ` · ${formatDate(expense.approvedOn)}` : ""}
            </dd>
          </div>
        )}
        {expense.notes && (
          <div>
            <dt>Notes</dt>
            <dd>{expense.notes}</dd>
          </div>
        )}
      </dl>

      <div className="fin-drawer-block">
        <h4 className="fin-drawer-subhead">
          <IconFile size={15} /> Supporting document
        </h4>
        <button
          className="fin-doc-row"
          onClick={() =>
            pushToast(
              "Document viewer", 
              "Prototype only — bill, lorry receipt and muster roll uploads are not implemented.",
              "info"
            )
          }
        >
          <span className="fin-doc-icon">
            <IconFile size={16} />
          </span>
          <span className="fin-doc-meta">
            <strong>{expense.receiptNo ?? expense.id.toUpperCase()}</strong>
            <span>Bill / receipt attachment</span>
          </span>
          <span className="fin-doc-view">View</span>
        </button>
      </div>

      <div className="fin-drawer-block">
        <h4 className="fin-drawer-subhead">
          <IconHistory size={15} /> Cost group reference
        </h4>
        <p className="fin-drawer-note">
          Booked under <strong>{expense.group}</strong>, one of {COST_GROUPS.length} construction cost
          groups used for consolidated site reporting.
        </p>
      </div>

      <button
        className="fin-btn fin-btn-ghost fin-btn-block"
        onClick={() => {
          pushToast("Editing", "Inline editing is a placeholder in this prototype.", "info");
          onClose();
        }}
      >
        <IconClose size={14} /> Edit expense
      </button>
    </Drawer>
  );
}
