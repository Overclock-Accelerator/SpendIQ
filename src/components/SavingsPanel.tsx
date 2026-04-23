"use client";

import { SavingsOpportunity } from "@/lib/types";

const PRIORITY_STYLES = {
  high: { dot: "bg-red-500", text: "text-red-700", label: "High" },
  medium: { dot: "bg-amber-500", text: "text-amber-700", label: "Med" },
  low: { dot: "bg-gray-400", text: "text-gray-600", label: "Low" },
};

export function SavingsPanel({
  opportunities,
}: {
  opportunities: SavingsOpportunity[];
}) {
  if (!opportunities.length) return null;

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
      <h3 className="mb-3 text-sm font-semibold text-emerald-800">
        Savings Opportunities
      </h3>
      <div className="space-y-2.5">
        {opportunities.map((opp, i) => {
          const style = PRIORITY_STYLES[opp.priority];
          return (
            <div
              key={i}
              className="flex items-start justify-between gap-4 rounded-lg bg-white px-4 py-3"
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={`mt-1.5 inline-block h-2 w-2 flex-shrink-0 rounded-full ${style.dot}`}
                />
                <div>
                  <p className="text-sm text-gray-700">{opp.description}</p>
                  <p className={`mt-0.5 text-xs font-medium ${style.text}`}>
                    {style.label} priority
                  </p>
                </div>
              </div>
              <span className="flex-shrink-0 text-sm font-semibold tabular-nums text-emerald-700">
                −${opp.potentialSavings.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
