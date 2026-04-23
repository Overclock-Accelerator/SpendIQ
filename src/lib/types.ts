export type ModelProvider = "anthropic" | "openai" | "openrouter";

export interface AIModel {
  id: string;
  name: string;
  provider: ModelProvider;
  modelId: string;
}

export interface ExpenseItem {
  description: string;
  amount: number;
  date: string;
  category: string;
  isRecurring: boolean;
  flag: "overspending" | "duplicate" | "cuttable" | null;
  flagReason: string | null;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
  percentOfTotal: number;
}

export interface SavingsOpportunity {
  description: string;
  potentialSavings: number;
  priority: "high" | "medium" | "low";
}

export interface AnalysisResult {
  expenses: ExpenseItem[];
  totalSpend: number;
  categories: CategoryBreakdown[];
  subscriptions: ExpenseItem[];
  savingsOpportunities: SavingsOpportunity[];
  summary: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  analysis?: AnalysisResult;
  isCSV?: boolean;
}
