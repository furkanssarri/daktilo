import PostForm from "@/components/layout/adminPanel/PostForm";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Post as PostType } from "@prisma/client";
import adminPostsApi from "@/api/adminApi/adminPostApi";

const EditPost = () => {
  const { id } = useParams();

  const [post, setPost] = useState<PostType | null>(null);

  useEffect(() => {
    if (!id) return;
    adminPostsApi
      .getById(id)
      .then((data) => setPost(data))
      .catch((err) => console.error("Failed to fetch the post: ", err));
  }, [id]);

  if (!post) return <p>Loading post...</p>;

  return (
    <>
      <h1>Edit post form</h1>

      <PostForm />
    </>
  );
};

export default EditPost;
