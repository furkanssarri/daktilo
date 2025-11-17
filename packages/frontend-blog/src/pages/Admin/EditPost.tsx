import PostForm from "@/components/layout/adminPanel/PostForm";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminPostsApi from "@/api/adminApi/adminPostApi";
import { toast } from "sonner";
import type { PostWithRelations } from "@/types/EntityTypes";

const EditPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
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

  useEffect(() => {
    console.log(post);
  }, [post]);

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
