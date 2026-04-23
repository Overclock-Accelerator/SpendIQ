"use client";

import { ExpenseItem } from "@/lib/types";

const FLAG_STYLES = {
  overspending: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Overspending" },
  duplicate: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Duplicate" },
  cuttable: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", label: "Cuttable" },
};

export function ExpenseTable({ expenses }: { expenses: ExpenseItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-5 py-3">
        <h3 className="text-sm font-semibold text-gray-800">Expense Breakdown</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-2.5 text-left font-medium text-gray-500">Description</th>
              <th className="px-5 py-2.5 text-left font-medium text-gray-500">Category</th>
              <th className="px-5 py-2.5 text-left font-medium text-gray-500">Date</th>
              <th className="px-5 py-2.5 text-right font-medium text-gray-500">Amount</th>
              <th className="px-5 py-2.5 text-left font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {expenses.map((expense, i) => {
              const flagStyle = expense.flag ? FLAG_STYLES[expense.flag] : null;
              return (
                <tr
                  key={i}
                  className={`transition-colors hover:bg-gray-50 ${flagStyle ? flagStyle.bg : ""}`}
                >
                  <td className="px-5 py-2.5 text-gray-800">
                    <div className="flex items-center gap-2">
                      {expense.description}
                      {expense.isRecurring && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                          Recurring
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-2.5 text-gray-500">{expense.category}</td>
                  <td className="px-5 py-2.5 tabular-nums text-gray-500">{expense.date}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums font-medium text-gray-800">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-2.5">
                    {flagStyle ? (
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${flagStyle.text} ${flagStyle.border}`}
                        title={expense.flagReason || undefined}
                      >
                        {flagStyle.label}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">OK</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
