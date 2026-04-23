"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ChatMessage, AnalysisResult } from "@/lib/types";
import { AI_MODELS } from "@/lib/models";
import { SAMPLE_CSV } from "@/lib/sample";
import { SummaryCards } from "@/components/SummaryCards";
import { ExpenseTable } from "@/components/ExpenseTable";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { SavingsPanel } from "@/components/SavingsPanel";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("claude-sonnet-4-6");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRawJSON, setShowRawJSON] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const analyzeExpenses = useCallback(
    async (content: string, isCSV: boolean) => {
      const userMessage: ChatMessage = {
        role: "user",
        content: isCSV ? `[Uploaded CSV — ${content.split("\n").length - 1} transactions]` : content,
        isCSV,
      };
      setMessages((prev) => [...prev, userMessage]);
      setError(null);
      setLoading(true);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, modelId: selectedModel }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const analysis = data.analysis as AnalysisResult;
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: analysis.summary,
          analysis,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Analysis failed");
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [selectedModel]
  );

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    analyzeExpenses(text, false);
  }, [input, loading, analyzeExpenses]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        analyzeExpenses(text, true);
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [analyzeExpenses]
  );

  const handleLoadSample = useCallback(() => {
    analyzeExpenses(SAMPLE_CSV, true);
  }, [analyzeExpenses]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const currentModel = AI_MODELS.find((m) => m.id === selectedModel);

  return (
    <div className="flex h-full flex-col bg-[#fafafa]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight text-gray-900">
            Spend<span className="text-emerald-600">IQ</span>
          </h1>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
            AI Expense Analyzer
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowRawJSON(!showRawJSON)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              showRawJSON
                ? "bg-gray-800 text-white"
                : "border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
            }`}
          >
            {showRawJSON ? "{ } Raw JSON ON" : "{ } Raw JSON"}
          </button>
          <label htmlFor="model" className="text-xs font-medium text-gray-400">
            Model
          </label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 transition-colors hover:border-gray-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          >
            {AI_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.provider})
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6">
            <div className="mb-6 text-4xl">💸</div>
            <h2 className="text-xl font-semibold text-gray-800">
              Upload your expenses
            </h2>
            <p className="mt-2 max-w-md text-center text-sm text-gray-400">
              Upload a CSV of expenses or describe your spending — SpendIQ will
              analyze it and flag overspending, duplicate subscriptions, and
              savings opportunities.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <label className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
                Upload CSV
                <input
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              <button
                onClick={handleLoadSample}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                Try sample data
              </button>
            </div>
            <p className="mt-4 text-xs text-gray-300">
              Using{" "}
              <span className="font-medium text-gray-500">
                {currentModel?.name}
              </span>
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[70%] rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm text-white">
                      {msg.content}
                    </div>
                  </div>
                ) : msg.analysis ? (
                  <div className="space-y-4">
                    {/* Summary text */}
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed text-gray-700 shadow-sm ring-1 ring-gray-100">
                      {msg.content}
                    </div>
                    {/* Raw JSON view */}
                    {showRawJSON && (
                      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
                        <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                            Raw AI Response (JSON)
                          </span>
                          <span className="text-[10px] text-gray-600">
                            This is the structured data powering the UI below
                          </span>
                        </div>
                        <pre className="max-h-80 overflow-auto p-4 text-xs leading-relaxed text-emerald-400">
                          {JSON.stringify(msg.analysis, null, 2)}
                        </pre>
                      </div>
                    )}
                    {/* Rich UI components */}
                    <SummaryCards analysis={msg.analysis} />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <ExpenseTable expenses={msg.analysis.expenses} />
                      </div>
                      <div className="space-y-4">
                        <CategoryBreakdown
                          categories={msg.analysis.categories}
                        />
                        <SavingsPanel
                          opportunities={msg.analysis.savingsOpportunities}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="max-w-[70%] rounded-2xl bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm ring-1 ring-gray-100">
                      {msg.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-emerald-500" />
                    Analyzing your expenses...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-auto w-full max-w-4xl px-4">
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-end gap-3">
          <label className="flex h-[44px] w-[44px] flex-shrink-0 cursor-pointer items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z" clipRule="evenodd" />
            </svg>
            <input
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste expenses or describe your spending..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            style={{ minHeight: "44px", maxHeight: "120px", height: "auto" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.289Z" />
            </svg>
          </button>
        </div>
        <p className="mx-auto mt-1.5 max-w-4xl text-center text-[11px] text-gray-300">
          {currentModel?.name} via {currentModel?.provider} &middot; Upload CSV or paste expense data
        </p>
      </div>
    </div>
  );
}
