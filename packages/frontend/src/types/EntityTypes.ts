import type {
  Post as PostType,
  Comment as CommentType,
  Tag as TagType,
  Prisma,
} from "@prisma/client";

export type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    comments: true;
    author: true;
    likes: true;
    tags: true;
    categories: true;
    image: true;
    _count: true;
  };
}>;

export type CreatePostFormData = {
  title: PostType["title"];
  content: PostType["content"];
  excerpt?: PostType["excerpt"];
  imageId?: PostType["imageId"];
  categoryId?: PostType["categoryId"];
  tags: TagType[];
};

export type UserWithRelations = Prisma.UserGetPayload<{
  include: { posts: true; comments: true; avatar: true };
}>;

export type FrontendComment = CommentType & {
  author?: { id: string; username: string; avatar: string | null };
};

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

export interface ResponseJsonObject<T> {
  status: "success" | "error";
  message: string;
  data?: T;
}
