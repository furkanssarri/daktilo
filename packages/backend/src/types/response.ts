export interface ResponseJsonObject<T> {
  status: "success" | "error";
  message: string;
  data?: T;
}

// --- Search Result Types ---

export interface PostSearchResult {
  type: "post";
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
}

export interface TagSearchResult {
  type: "tag";
  id: string;
  name: string;
}

export interface CategorySearchResult {
  type: "category";
  id: string;
  name: string;
  description: string | null;
}

export type SearchResult =
  | PostSearchResult
  | TagSearchResult
  | CategorySearchResult;
