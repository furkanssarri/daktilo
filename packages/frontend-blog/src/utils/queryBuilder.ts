/**
 * Helper to build query string for includes.
 * Converts { author: true, comments: true } → ?include=author,comments
 */
function buildIncludeQuery(options?: Partial<Record<string, boolean>>): string {
  if (!options) return "";
  const includeKeys = Object.keys(options).filter((key) => options[key]);
  return includeKeys.length ? `?include=${includeKeys.join(",")}` : "";
}

export default buildIncludeQuery;
