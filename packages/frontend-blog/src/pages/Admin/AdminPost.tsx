import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import adminPostsApi from "@/api/adminApi/adminPostApi";
import { toast } from "sonner";
import type { PostWithRelations } from "@/types/EntityTypes";
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
} from "@/components/ui/alert-dialog";

const AdminPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleDelete = async () => {
    if (!post) return;
    try {
      await adminPostsApi.delete(post.id);
      setPost(null);
      toast.success("Post deleted.", {
        description: `“${post.title}” has been removed.`,
      });
    } catch (err) {
      console.error("Failed to delete post:", err);
      toast.error("Error", {
        description: "Something went wrong while deleting the post.",
      });
    } finally {
      setIsDeleteOpen(false);
    }
    navigate(-1);
  };

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
    <div className="mx-auto mt-5 max-w-4xl space-y-10 rounded-sm border px-6 py-12">
      {/* Header Section */}
      <section className="space-y-3 text-center">
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <p className="text-muted-foreground">{post.excerpt}</p>
        <div className="text-muted-foreground flex flex-wrap justify-center gap-2 text-sm">
          <Badge variant="secondary">
            {new Date(post.createdAt).toLocaleDateString()}
          </Badge>
          <Badge variant={"outline"}>
            {post.isPublished ? "Published" : "Not Published"}
          </Badge>
          <Badge variant={"default"}>{post.categories?.name}</Badge> <hr />
          {Array.isArray(post.tags) &&
            post.tags.map((tag) => (
              <Badge key={tag.id} variant={"outline"}>
                {tag.name}
              </Badge>
            ))}
        </div>
        {/* Featured Image */}
        {post.imageId && (
          <div className="max-h-[480px] w-full overflow-hidden rounded-lg shadow-sm">
            <img
              src={post.image?.url}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}{" "}
      </section>

      <Separator />

      {/* Post Content Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back to All Posts
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate(`/admin/posts/slug/${post.slug}/edit`)}
        >
          Edit Post
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            setIsDeleteOpen(true);
          }}
        >
          Delete
        </Button>
      </div>
      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete “{post?.title}”? This action
              cannot be undone.
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
    </div>
  );
};

export default AdminPost;
