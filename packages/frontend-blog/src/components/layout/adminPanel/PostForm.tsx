import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SelectCategoryTag from "@/components/layout/adminPanel/SelectCategorTag";
import type { CategoryDTO, PostFormValues, TagDTO } from "@/types/EntityTypes";

interface PostFormProps {
  initialData?: {
    title: string;
    excerpt: string;
    content: string;
    categoryId: string | null;
    imageId?: string | null;
    tags?: { id: string; name: string }[];
  };
  categories: CategoryDTO[];
  tags: TagDTO[];
  onSubmit: (data: PostFormValues) => void;
  isSubmitting?: boolean;
}

const PostForm = ({
  initialData,
  categories,
  tags,
  onSubmit,
  isSubmitting = false,
}: PostFormProps) => {
  const [formData, setFormData] = useState<PostFormValues>({
    title: "",
    excerpt: "",
    content: "",
    categoryId: null,
    tagIds: [] as string[],
    imageId: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        excerpt: initialData.excerpt,
        content: initialData.content,
        categoryId: initialData.categoryId || null,
        tagIds: initialData.tags?.map((t) => t.id) ?? [],
        imageId: initialData.imageId || null,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Post" : "Create New Post"}</CardTitle>
      </CardHeader>

      <Separator />

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Input
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              rows={12}
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category & Tags */}
          <SelectCategoryTag
            categories={categories}
            tags={tags}
            selectedCategory={formData.categoryId}
            selectedTags={formData.tagIds}
            onCategoryChange={(categoryId) =>
              setFormData((p) => ({ ...p, categoryId }))
            }
            onTagsChange={(tagIds) => setFormData((p) => ({ ...p, tagIds }))}
          />
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : initialData
                ? "Update Post"
                : "Create Post"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PostForm;
