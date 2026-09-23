export interface ForwardRequest {
  dateFrom: string;
  dateTo: string;
}

export interface CategoryLine {
  category: string;
  total: number;
  count: number;
}

export interface ForwardSummary {
  formattedText: string;
  dateFrom: string;
  dateTo: string;
  total: number;
  totalCount: number;
  byCategory: Record<string, CategoryLine>;
}
