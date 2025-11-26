import { Router } from "express";
import prisma from "../db/prismaClient.js";
import type { Request, Response } from "express";
import sendResponse from "../utils/responseUtil.js";
import {
  CategorySearchResult,
  PostSearchResult,
  ResponseJsonObject,
  SearchResult,
  TagSearchResult,
} from "../types/response.js";

const router = Router();

router.all(
  "/",
  async (
    req: Request,
    res: Response<ResponseJsonObject<{ results: SearchResult[] }>>,
  ) => {
    // Safely normalize q to a string
    const qRaw = req.query.q;
    let qStr: string | null = null;

    if (typeof qRaw === "string") {
      qStr = qRaw;
    } else if (Array.isArray(qRaw)) {
      const first = qRaw[0];
      if (typeof first === "string") {
        qStr = first;
      }
    } else if (typeof qRaw === "object" && qRaw !== null) {
      // qs may parse nested query objects; convert to string gracefully
      const maybeString = (qRaw as any).q;
      if (typeof maybeString === "string") {
        qStr = maybeString;
      }
    }

    const q = qStr?.trim() ?? "";

    if (q.length < 2)
      return sendResponse(
        res,
        "error",
        "Bad request: search query is too short.",
      );

    if (!q)
      return sendResponse(
        res,
        "error",
        "Missing parameter(s): search parameters.",
      );

    try {
      // --- Search Posts ---
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
        },
      });

      // --- Search Tags ---
      const tags = await prisma.tag.findMany({
        where: {
          OR: [{ name: { contains: q, mode: "insensitive" } }],
        },
        select: {
          id: true,
          name: true,
        },
      });

      // --- Search Categories ---
      const categories = await prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });

      // unify & type results
      const results: SearchResult[] = [
        ...posts.map<PostSearchResult>((p) => ({
          type: "post",
          id: p.id,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
        })),
        ...tags.map<TagSearchResult>((t) => ({
          type: "tag",
          id: t.id,
          name: t.name,
        })),
        ...categories.map<CategorySearchResult>((c) => ({
          type: "category",
          id: c.id,
          name: c.name,
          description: c.description,
        })),
      ];

      if (!Array.isArray(results) || results.length === 0)
        return sendResponse(res, "error", "Nothing found.", undefined, 404);

      //else
      return sendResponse(res, "success", "Found queries.", { results });
    } catch (err) {
      console.error("Search error:", err);
      return sendResponse(
        res,
        "error",
        "Internal Server Error.",
        undefined,
        500,
      );
    }
  },
);

export default router;
