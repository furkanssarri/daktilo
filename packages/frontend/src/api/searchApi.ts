import { apiRequest } from "./apiClient";
import type { SearchResult, ResponseJsonObject } from "@/types/EntityTypes"; // adjust this import based on your alias mapping

/**
 * Perform a unified multi-model search (posts, tags, categories).
 *
 * @param query search string
 * @returns ResponseJsonObject<{ results: SearchResult[] }>
 */
export async function searchApi(
  query: string,
): Promise<ResponseJsonObject<{ results: SearchResult[] }>> {
  if (!query || query.trim().length < 2) {
    return {
      status: "error",
      message: "Search query too short.",
      data: { results: [] },
    };
  }

  return apiRequest<ResponseJsonObject<{ results: SearchResult[] }>>(
    `/search?q=${encodeURIComponent(query.trim())}`,
  );
}
