export type PostType = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  categoryId: string;
  imageUrl: string;
  readTime?: number;
};
