import { apiRequest } from "./apiClient";

const categoryApi = {
  getAll: () => apiRequest("/categories"),
  getPostsByName: (name: string) => apiRequest(`/categories/ ${name}/posts`),
};

export default categoryApi;
