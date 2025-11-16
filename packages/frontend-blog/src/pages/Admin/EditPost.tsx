import PostForm from "@/components/layout/adminPanel/PostForm";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Post as PostType } from "@prisma/client";
import adminPostsApi from "@/api/adminApi/adminPostApi";
import { toast } from "sonner";

const EditPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    adminPostsApi
      .getBySlug(slug)
      .then((data) => setPost(data))
      .catch((err) => {
        console.error("Failed to fetch post:", err);
        toast.error("Error", {
          description: "Failed to load post details.",
        });
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="text-muted-foreground flex h-[50vh] items-center justify-center">
        Loading post details...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-muted-foreground flex h-[50vh] items-center justify-center">
        Post not found.
      </div>
    );
  }

  return (
    <>
      <PostForm mode="edit" initialData={post} />
    </>
  );
};

export default EditPost;
