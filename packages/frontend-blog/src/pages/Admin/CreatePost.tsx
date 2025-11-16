import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "@/components/layout/adminPanel/PostForm";
import adminPostsApi from "@/api/adminApi/adminPostApi";
import { toast } from "sonner";
import adminCategoriesApi from "@/api/adminApi/adminCategoriesApi";
import adminTagsApi from "@/api/adminApi/adminTagsApi";
import type { CategoryDTO, TagDTO, PostFormValues } from "@/types/EntityTypes";

const CreatePost = () => {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    adminCategoriesApi
      .getAll()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  // Fetch tags
  useEffect(() => {
    adminTagsApi
      .getAll()
      .then((data) => setTags(data))
      .catch((err) => console.error("Failed to fetch tags:", err));
  }, []);

  // Handle submit from PostForm
  const handleCreate = async (data: PostFormValues) => {
    try {
      setIsSubmitting(true);

      // Pass the form data directly
      const newPost = await adminPostsApi.create(data);

      toast.success("Post created successfully!", {
        description: `“${newPost.title}” has been created.`,
      });

      navigate(`/admin/posts/${newPost.slug}`);
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Error creating post.", {
        description: "Please check your form and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl py-10">
      <PostForm
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        categories={categories}
        tags={tags}
      />
    </div>
  );
};

export default CreatePost;
