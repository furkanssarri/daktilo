import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import type { Post as PostType } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import adminPostsApi from "@/api/adminApi/adminPostApi";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@radix-ui/react-alert-dialog";
import { toast } from "sonner";

type ManagePostsSectionPropTypes = {
  allPosts: PostType[];
  setAllPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
};

// TODO: REFACTOR THIS COMPONENT TO EXTRACT STANDALONE FOR REUSABILITY WITH ADMINALLPOSTS

const ManagePostsSection = ({
  allPosts,
  setAllPosts,
}: ManagePostsSectionPropTypes) => {
  const posts = useScrollFadeIn();
  const navigate = useNavigate();

  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = async () => {
    if (!selectedPost) return;
    try {
      await adminPostsApi.delete(selectedPost.id);
      setAllPosts((prev) => prev.filter((p) => p.id !== selectedPost.id));
      toast.success("Post deleted.", {
        description: `“${selectedPost.title}” has been removed.`,
      });
    } catch (err) {
      console.error("Failed to delete post:", err);
      toast.error("Error", {
        description: "Something went wrong while deleting the post.",
      });
    } finally {
      setIsDeleteOpen(false);
      setSelectedPost(null);
    }
  };

  const latestPosts = allPosts.slice(-3).reverse();
  return (
    <section
      ref={posts.ref}
      className={`scroll-fade space-y-6 ${posts.isVisible ? "visible" : ""}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Manage Posts</h2>
        <Button asChild variant="default">
          <Link to="/admin/posts/create">+ New Post</Link>
        </Button>
      </div>
      <p className="text-muted-foreground">
        View, edit, or delete existing posts.
      </p>

      <div className="space-y-4">
        {latestPosts &&
          latestPosts.map((post) => (
            <Card key={post.id} className="transition hover:shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  <Link to={`/admin/posts/slug/${post.slug}`}>
                    {post.title}
                  </Link>
                </CardTitle>
                <Badge variant="outline">
                  {post.isPublished ? "Published" : "Not published"}
                </Badge>
              </CardHeader>
              <CardContent className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/posts/slug/${post.slug}`)}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(`/admin/posts/slug/${post.slug}/edit`)
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post);
                    setIsDeleteOpen(true);
                  }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>
      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete “{selectedPost?.title}”? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default ManagePostsSection;
