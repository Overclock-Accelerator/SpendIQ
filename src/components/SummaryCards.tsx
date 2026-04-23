"use client";

import { AnalysisResult } from "@/lib/types";

export function SummaryCards({ analysis }: { analysis: AnalysisResult }) {
  const flaggedCount = analysis.expenses.filter((e) => e.flag).length;
  const totalSavings = analysis.savingsOpportunities.reduce(
    (sum, s) => sum + s.potentialSavings,
    0
  );

  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-xs font-medium text-gray-400">Total Spend</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-gray-900">
          ${analysis.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-xs font-medium text-gray-400">Transactions</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-gray-900">
          {analysis.expenses.length}
        </p>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-medium text-amber-600">Flagged Items</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-amber-700">
          {flaggedCount}
        </p>
      </div>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs font-medium text-emerald-600">Potential Savings</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-700">
          ${totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}
