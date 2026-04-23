"use client";

import { CategoryBreakdown as CategoryBreakdownType } from "@/lib/types";

const CATEGORY_COLORS: Record<string, string> = {
  "Subscriptions": "bg-violet-500",
  "Food & Dining": "bg-orange-500",
  "Transportation": "bg-blue-500",
  "Shopping": "bg-pink-500",
  "Entertainment": "bg-indigo-500",
  "Utilities": "bg-teal-500",
  "Housing": "bg-slate-500",
  "Health": "bg-emerald-500",
  "Travel": "bg-cyan-500",
  "Other": "bg-gray-400",
};

export function CategoryBreakdown({
  categories,
}: {
  categories: CategoryBreakdownType[];
}) {
  const sorted = [...categories].sort((a, b) => b.total - a.total);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-gray-800">
        Spending by Category
      </h3>
      <div className="space-y-3">
        {sorted.map((cat) => {
          const color = CATEGORY_COLORS[cat.category] || "bg-gray-400";
          return (
            <div key={cat.category}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{cat.category}</span>
                <span className="tabular-nums font-medium text-gray-800">
                  ${cat.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
                  <span className="text-xs text-gray-400">
                    ({cat.percentOfTotal.toFixed(0)}%)
                  </span>
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${color} transition-all`}
                  style={{ width: `${cat.percentOfTotal}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
