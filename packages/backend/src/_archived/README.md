# Archived Utilities

These files were part of a previous abstraction layer for post-related logic.

- `postService.ts`: handled Prisma queries and user-role filtering (admin vs public).
- `postQueryHelper.ts`: provided reusable Prisma include/formatting logic for posts.

These files have been replaced with direct Prisma queries in controllers to simplify the architecture.  
They are **kept here for reference** in case a future decision is made to reintroduce a service layer or to reuse some patterns.

⚠️ These files are **not imported** anywhere in the current app.
