import { useEffect, useState } from "react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import adminPostsApi from "@/api/adminApi/adminPostApi";
import type { Post as PostType } from "@prisma/client";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminAllPosts = () => {
  const posts = useScrollFadeIn();
  const navigate = useNavigate();

  const [allPosts, setAllPosts] = useState<PostType[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editedPost, setEditedPost] = useState({
    title: "",
    content: "",
    excerpt: "",
  });

  useEffect(() => {
    adminPostsApi
      .getAll()
      .then((data) => setAllPosts(data))
      .catch((err) => console.error("Failed to fetch admin posts:", err));
  }, []);

  // const handleEdit = (post: PostType) => {
  //   setSelectedPost(post);
  //   setEditedPost({
  //     title: post.title,
  //     content: post.content,
  //     excerpt: post.excerpt || "",
  //   });
  //   setIsDialogOpen(true);
  // };

  const handleUpdate = async () => {
    if (!selectedPost) return;
    try {
      const updated = await adminPostsApi.update(selectedPost.id, editedPost);
      setAllPosts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p)),
      );
      toast.success("Post updated.", {
        description: `“${updated.title}” was successfully updated.`,
      });
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to update post:", err);
      toast.error("Error", {
        description: "Something went wrong while updating the post.",
      });
    }
  };

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

  return (
    <div className="mx-auto mt-5 max-w-5xl space-y-24 rounded-sm border px-6 py-16">
      {/* Header Section */}
      <section className="flex flex-col items-center space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold sm:text-5xl">Manage All Posts</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Review, edit, or delete existing posts — or click any post below to
            view it directly.
          </p>
        </div>
      </section>

      <Separator />

      {/* Posts List Section */}
      <section
        ref={posts.ref}
        className={`scroll-fade space-y-6 ${posts.isVisible ? "visible" : ""}`}
      >
        <h2 className="text-2xl font-semibold">All Blog Posts</h2>
        <p className="text-muted-foreground">
          Browse through every published post on the platform.
        </p>

        <Button asChild variant="default" className="mt-4">
          <Link to="/admin/posts/create">Create New Post</Link>
        </Button>
        <div className="space-y-4">
          {allPosts.length === 0 ? (
            <p className="text-muted-foreground py-10 text-center">
              No posts found.
            </p>
          ) : (
            allPosts.map((post) => (
              <Card
                key={post.id}
                className="hover:border-primary/30 cursor-pointer transition hover:shadow-sm"
              >
                <Link to={`/admin/posts/slug/${post.slug}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold">
                        {post.title}
                      </CardTitle>
                      <Badge variant="secondary">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                    <CardDescription className="text-muted-foreground line-clamp-2">
                      {post.excerpt || "No excerpt available."}
                    </CardDescription>
                  </CardHeader>
                </Link>
                <CardContent className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/posts/slug/${post.slug}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="secondary"
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
            ))
          )}
        </div>
      </section>

      {/* Edit Post Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Modify the fields below and save your changes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedPost.title}
                onChange={(e) =>
                  setEditedPost({ ...editedPost, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Input
                id="excerpt"
                value={editedPost.excerpt}
                onChange={(e) =>
                  setEditedPost({ ...editedPost, excerpt: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                rows={6}
                value={editedPost.content}
                onChange={(e) =>
                  setEditedPost({ ...editedPost, content: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </div>
  );
};

export default AdminAllPosts;
