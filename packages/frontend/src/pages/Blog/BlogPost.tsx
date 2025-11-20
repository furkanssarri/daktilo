import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import postApi from "@/api/postApi";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import CommentCard from "@/components/layout/CommentCard";
import type { FrontendComment, PostWithRelations } from "@/types/EntityTypes";
import NotFoundElement from "@/components/custom/NotFoundElement";
import commentApi from "@/api/commentApi";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";

const BlogPost = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [comments, setComments] = useState<FrontendComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentToEdit, setCommentToEdit] = useState<FrontendComment | null>(
    null,
  );
  const [editedContent, setEditedContent] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      try {
        const post = await postApi.getBySlug(slug);
        setPost(post);
        setComments(post.comments ?? []);

        if (user) {
          setIsLiked(post.likes?.some((l) => l.authorId === user.id) ?? false);
        }
      } catch (err) {
        console.error("Failed to fetch the post:", err);
      }
    };
    load();
  }, [slug, user]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !post) return;
    console.log("Submitting comment: ", newComment);
    try {
      const created = await commentApi.create({
        content: newComment,
        postId: post.id,
      });
      setComments((prev) => [...prev, created]);
      setNewComment("");
      toast.success("Comment added!");
    } catch (err) {
      console.error("Failed to add comment: ", err);
      toast.error("Failed to add comment.");
    }
    commentApi.create({ content: newComment, postId: post.id });
    setNewComment("");
  };

  const handleEditComment = async () => {
    if (!commentToEdit || !editedContent.trim()) return;

    try {
      const updated = await commentApi.update(commentToEdit.id, {
        content: editedContent,
      });
      setComments((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)),
      );
      setCommentToEdit(null);
      setEditedContent("");
      toast.success("Comment updated!");
    } catch (err) {
      console.error("Failed to update comment: ", err);
      toast.error("Failed to update comment.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      commentApi.delete(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comment deleted...");
    } catch (err) {
      console.error("Failed to delete comment: ", err);
    }
  };

  const handleToggleLike = async () => {
    if (!post) return;
    try {
      const response = await postApi.likePost(post.id);
      // optionally update local post.like count
      setPost((prev) =>
        prev
          ? { ...prev, _count: { ...prev._count, likes: response.likeCount } }
          : prev,
      );
    } catch (err) {
      console.error("Failed to toggle like:", err);
      toast.error("Something went wrong while toggling like.");
    }
  };

  if (!post) {
    return <NotFoundElement />;
  }

  return (
    <article className="mx-auto max-w-5xl space-y-12 px-1 py-16">
      <Toaster position="top-center" />
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
          <p>{post.categories?.name}</p>
        </div>
      </header>

      {/* Featured Image */}
      {post.imageId && (
        <div className="max-h-[480px] w-full overflow-hidden rounded-lg shadow-sm">
          <img
            src={post.image?.url || ""}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Post Content */}
      <Card className="shadow-sm">
        <CardHeader>{/* <CardTitle>Content</CardTitle> */}</CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </CardContent>
      </Card>

      {isAuthenticated && (
        <>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleToggleLike}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isLiked
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {isLiked ? "♥ Liked" : "♡ Like"}
            </button>

            {post?._count?.likes !== undefined && (
              <span className="text-muted-foreground text-sm">
                {post._count.likes} {post._count.likes === 1 ? "like" : "likes"}
              </span>
            )}
          </div>

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
        </>
      )}
      {/* Comments Section */}
      <section className="mx-auto mt-12 max-w-3xl space-y-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          Comments ({post.comments.length})
        </h2>

        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <CommentCard
                comment={comment}
                commentToEdit={commentToEdit}
                setCommentToEdit={setCommentToEdit}
                editedContent={editedContent}
                setEditedContent={setEditedContent}
                handleEditComment={handleEditComment}
                handleDeleteComment={handleDeleteComment}
              />
            </div>
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
