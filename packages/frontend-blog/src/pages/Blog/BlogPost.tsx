import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import postApi from "@/api/postApi";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import CommentCard from "@/components/custom/CommentCard";

import type { FrontendComment, PostWithRelations } from "@/types/EntityTypes";
import NotFoundElement from "@/components/custom/NotFoundElement";

const BlogPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [comments, setComments] = useState<FrontendComment[]>([]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    console.log("Submitting comment: ", newComment);
    // TODO: integrate postApi.commentOnPost(post.id, newComment)
    if (post) {
      postApi.commentOnPost(post?.id, newComment);
      setNewComment("");
    }
  };

  useEffect(() => {
    if (postId) {
      postApi
        .getBySlug(postId)
        .then((post) => {
          setPost(post);
        })
        .catch((err) => console.error("Failed to fetch the post: ", err));
    }
  }, [postId]);

  useEffect(() => {
    if (post) {
      setComments(post.comments ?? []);
    }
  }, [post, comments]);

  if (!post) {
    return <NotFoundElement />;
  }

  return (
    <article className="mx-auto max-w-5xl space-y-12 px-6 py-16">
      {/* Header Section */}
      <header className="space-y-6 text-center">
        <h1 className="text-4xl leading-tight font-bold sm:text-5xl">
          {post.title}
        </h1>

        <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 text-sm sm:flex-row">
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
      {post.imageId && (
        <div className="max-h-[480px] w-full overflow-hidden rounded-lg shadow-sm">
          <img
            src={post.imageId || ""}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Post Content */}
      <Card className="prose dark:prose-invert mx-auto max-w-none px-8 py-10 leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </Card>

      {/* Comments Section */}
      <section className="mx-auto mt-12 max-w-3xl space-y-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          Comments ({post.comments.length})
        </h2>
        {/* Add Comment Section */}
        <section className="mx-auto mt-16 max-w-3xl">
          <h3 className="mb-4 text-xl font-semibold tracking-tight">
            Add a Comment
          </h3>

          <Card className="border-border space-y-4 border bg-none p-6 shadow-sm">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="border-input bg-background focus-visible:ring-ring min-h-[100px] w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddComment}
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
              >
                Post Comment
              </button>
            </div>
          </Card>
        </section>

        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="text-muted-foreground text-center">
            No comments yet. Be the first to leave one!
          </p>
        )}
      </section>
      {/* Footer / Back link */}
      <footer className="pt-10 text-center">
        <Link
          to="/blog"
          className="text-primary font-medium tracking-wide hover:underline"
        >
          ← Back to All Posts
        </Link>
      </footer>
    </article>
  );
};

export default BlogPost;
