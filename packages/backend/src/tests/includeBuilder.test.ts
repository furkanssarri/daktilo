import { buildQueryOptions } from "../utils/includeBuilder.js";

describe("buildQueryOptions", () => {
  describe("author inclusion", () => {
    it("should correctly include 'author' with specified select fields when 'author' is in query.include", () => {
      const query = { include: "author" };
      const result = buildQueryOptions(query, false);

      expect(result.include.author).toEqual({
        select: { id: true, username: true, avatar: true },
      });
    });
  });

  describe("comments inclusion", () => {
    it("should correctly include 'comments' with nested 'author' (and its select fields) when 'comments' is in query.include", () => {
      const query = { include: "comments" };
      const result = buildQueryOptions(query, false);

      expect(result.include.comments).toEqual({
        include: {
          author: { select: { id: true, username: true, avatar: true } },
        },
      });
    });
  });

  describe("deep inclusion", () => {
    it("should correctly handle deep inclusion like 'comments.author'", () => {
      const query = { include: "comments.author" };
      const result = buildQueryOptions(query, false);

      expect(result.include.comments).toEqual({
        include: {
          author: { select: { id: true, username: true, avatar: true } },
        },
      });
    });
  });

  describe("admin filtering", () => {
    it("should correctly filter for 'isPublished = true' when admin is false", () => {
      const query = {};
      const result = buildQueryOptions(query, false);

      expect(result.where.isPublished).toBe(true);
    });

    it("should not filter for 'isPublished' when admin is true", () => {
      const query = {};
      const result = buildQueryOptions(query, true);

      expect(result.where.isPublished).toBeUndefined();
    });
  });

  describe("multiple includes", () => {
    it("should correctly process multiple comma-separated includes in query.include", () => {
      const query = { include: "author,comments,categories" };
      const result = buildQueryOptions(query, false);

      expect(result.include.author).toEqual({
        select: { id: true, username: true, avatar: true },
      });
      expect(result.include.comments).toEqual({
        include: {
          author: { select: { id: true, username: true, avatar: true } },
        },
      });
      expect(result.include.categories).toBe(true);
    });

    it("should handle multiple includes with whitespace", () => {
      const query = { include: " author , comments , tags " };
      const result = buildQueryOptions(query, false);

      expect(result.include.author).toEqual({
        select: { id: true, username: true, avatar: true },
      });
      expect(result.include.comments).toEqual({
        include: {
          author: { select: { id: true, username: true, avatar: true } },
        },
      });
      expect(result.include.tags).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should return empty include and where objects when query is empty", () => {
      const query = {};
      const result = buildQueryOptions(query, true);

      expect(Object.keys(result.include)).toHaveLength(0);
      expect(result.where.isPublished).toBeUndefined();
    });

    it("should handle undefined query parameter", () => {
      const result = buildQueryOptions(undefined, false);

      expect(Object.keys(result.include)).toHaveLength(0);
      expect(result.where.isPublished).toBe(true);
    });

    it("should throw error for null query parameter", () => {
      expect(() => buildQueryOptions(null, false)).toThrow();
    });

    it("should handle query with empty include string", () => {
      const query = { include: "" };
      const result = buildQueryOptions(query, false);

      expect(Object.keys(result.include)).toHaveLength(0);
      expect(result.where.isPublished).toBe(true);
    });

    it("should include all supported relations", () => {
      const query = { include: "author,comments,categories,tags,likes" };
      const result = buildQueryOptions(query, false);

      expect(result.include.author).toBeDefined();
      expect(result.include.comments).toBeDefined();
      expect(result.include.categories).toBe(true);
      expect(result.include.tags).toBe(true);
      expect(result.include.likes).toBe(true);
    });
  });
});
