import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import type { Post as PostType } from "@prisma/client";
import postApi from "@/api/postApi";

const Post = () => {
  const { postSlug } = useParams();
  const [post, setPost] = useState<PostType | null>(null);

  useEffect(() => {
    if (postSlug) {
      postApi
        .getBySlug(postSlug)
        .then((data: PostType) => setPost(data))
        .catch((err) => console.error("Failed to fetch the post: ", err));
    }
  }, [postSlug]);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-center space-y-4">
        <h1 className="text-4xl font-bold">Post Not Found</h1>
        <p className="text-muted-foreground">
          Sorry, we couldn’t find the article you’re looking for.
        </p>
        <Link to="/blog" className="text-primary hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      {/* Header Section */}
      <header className="space-y-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-sm text-muted-foreground">
          <p>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {/* {post.readTime && <p>• {post.readTime} min read</p>} */}
          <p>{post.categoryId}</p>
        </div>
      </header>

      {/* Featured Image */}
      {/* {post.imageUrl && (
        <div className="w-full max-h-[480px] overflow-hidden rounded-lg shadow-sm">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )} */}

      {/* Content Section */}
      <Card className="prose dark:prose-invert max-w-none mx-auto px-8 py-10 leading-relaxed">
        {post.content.split("\n\n").map((para, i) => (
          <p key={i} className="mb-6 last:mb-0">
            {para}
          </p>
        ))}
      </Card>

      {/* Footer / Back link */}
      <footer className="text-center pt-10">
        <Link
          to="/blog"
          className="text-primary hover:underline font-medium tracking-wide"
        >
          ← Back to All Posts
        </Link>
      </footer>
    </article>
  );
};

export default Post;
