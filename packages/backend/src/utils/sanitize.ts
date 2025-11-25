import sanitizeHtml from "sanitize-html";

export function sanitizePostInput(input: {
  title: string;
  excerpt: string | null;
  content: string;
}) {
  return {
    title: sanitizeHtml(input.title, {
      allowedTags: [],
      allowedAttributes: {},
    }),
    excerpt:
      input.excerpt ?
        sanitizeHtml(input.excerpt, {
          allowedTags: [],
          allowedAttributes: {},
        })
      : null,
    content: sanitizeHtml(input.content, {
      allowedTags: [],
      allowedAttributes: {},
      disallowedTagsMode: "discard",
    }),
  };
}
