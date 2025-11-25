import { body } from "express-validator";
import sanitizeHtml from "sanitize-html";

export const createCommentValidator = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment cannot be empty.")
    .isLength({ max: 500 })
    .withMessage("Comment cannot exceed 500 characters.")

    // escape basic HTML characters
    .escape()

    // sanitize harmful HTML while allowing harmless formatting
    .customSanitizer((value) => {
      return sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {},
      });
    }),

  body("postId").notEmpty().withMessage("postId is required.").isString(),
];
