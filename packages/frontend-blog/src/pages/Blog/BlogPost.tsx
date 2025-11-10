import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import postApi from "@/api/postApi";
import commentApi from "@/api/commentApi";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import CommentCard from "@/components/custom/CommentCard";

import type { FrontendComment, PostWithRelations } from "@/types/EntityTypes";
import NotFoundElement from "@/components/custom/NotFoundElement";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@radix-ui/react-dialog";
import { useAuth } from "@/context/AuthContext";

const BlogPost = () => {
  const { postId } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [comments, setComments] = useState<FrontendComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<FrontendComment | null>(
    null,
  );
  const [editedContent, setEditedContent] = useState("");

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
    if (!editingComment || !editedContent.trim()) return;

    try {
      const updated = await commentApi.update(editingComment.id, {
        content: editedContent,
      });
      setComments((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)),
      );
      setEditingComment(null);
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

  useEffect(() => {
    if (postId) {
      postApi
        .getBySlug(postId)
        .then((post) => {
          setPost(post);
          setComments(post.comments ?? []);
        })
        .catch((err) => console.error("Failed to fetch the post: ", err));
    }
  }, [postId]);

  if (!post) {
    return <NotFoundElement />;
  }

  return (
    <article className="mx-auto max-w-5xl space-y-12 px-6 py-16">
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
            <div key={comment.id} className="space-y-3">
              <CommentCard comment={comment} />
              {user?.id === comment.authorId && (
                <div className="flex justify-end gap-2">
                  <Dialog
                    open={editingComment?.id === comment.id}
                    onOpenChange={(open) => {
                      if (!open) {
                        setEditingComment(null);
                        setEditedContent("");
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingComment(comment);
                          setEditedContent(comment.content);
                        }}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Comment</DialogTitle>
                        <DialogDescription>
                          Update your comment below.
                        </DialogDescription>
                      </DialogHeader>

                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="border-input bg-background focus-visible:ring-ring min-h-[100px] w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2"
                      />

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleEditComment}>
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this comment? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteComment(comment.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
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
