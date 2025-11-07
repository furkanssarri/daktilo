import { apiRequest } from "./apiClient";

const tagApi = {
  getAll: () => apiRequest("/tags"),
  getPostsBySlug: (slug: string) => apiRequest(`/tags/${slug}/posts`),
};

export default tagApi;
