import { useState } from "react";
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
// import SelectCategoryTag from "@/components/layout/adminPanel/SelectCategorTag";
import adminPostsApi from "@/api/adminApi/adminPostApi";
import type { CreatePostFormData } from "@/types/EntityTypes";
import type { Post as PostType } from "@prisma/client";
// import { useNavigate } from "react-router-dom";

type CreateProps = {
  mode: "create";
  initialData?: undefined;
};

type EditProps = {
  mode: "edit";
  initialData: PostType;
};

type PostFormProps = CreateProps | EditProps;

const PostForm = ({ mode, initialData }: PostFormProps) => {
  const isEdit = mode === "edit";
  // const navigate = useNavigate()
  const [isSubmitting, setIsSubmiting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<CreatePostFormData>({
    title: isEdit ? initialData.title : "",
    excerpt: isEdit ? (initialData.excerpt ?? "") : "",
    content: isEdit ? initialData.content : "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, files, type } = e.target as HTMLInputElement;
    if (type === "file" && files) {
      setImageFile(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmiting(true);

    if (mode === "create") {
      await handleCreate();
    } else {
      await handleEdit();
    }

    setIsSubmiting(false);
  };

  const handleCreate = async () => {
    const newPost = await adminPostsApi.create(formData);

    if (imageFile) {
      const uploaded = await adminPostsApi.uploadImage(imageFile);
      console.log("Uploaded image:", uploaded);
    }

    console.log("Created:", newPost);
  };

  const handleEdit = async () => {
    if (!initialData) return;
    const updatedPost = await adminPostsApi.update(initialData.slug, formData);

    if (imageFile) {
      const uploaded = await adminPostsApi.uploadImage(imageFile);
      console.log("Updated image:", uploaded);
    }

    console.log("Updated:", updatedPost);
  };

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Post" : "Create New Post"}</CardTitle>
      </CardHeader>

      <Separator />

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8 py-6">
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
              value={formData.excerpt ? formData.excerpt : ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageFile">Image</Label>
            <Input
              id="imageFile"
              name="imageFile"
              type="file"
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              className="h-100"
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category & Tags */}
          {/* <SelectCategoryTag
            categories={categories}
            tags={tags}
            selectedCategory={formData.categoryId}
            selectedTags={formData.tagIds}
            onCategoryChange={(categoryId) =>
              setFormData((p) => ({ ...p, categoryId }))
            }
            onTagsChange={(tagIds) => setFormData((p) => ({ ...p, tagIds }))}
          /> */}
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
