import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import adminPostsApi from "@/api/adminApi/adminPostApi";
import { toast } from "sonner";
import type { PostWithRelations } from "@/types/EntityTypes";

const AdminPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
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
          <Badge>{post.slug}</Badge>
          <Badge variant={"outline"}>
            {post.isPublished ? "Published" : "Not Published"}
          </Badge>
          <Badge variant={"default"}>{post.categoryId}</Badge>
          {Array.isArray(post.tags) &&
            post.tags.map((tag) => (
              <Badge key={tag.id} variant={"outline"}>
                {tag.name}
              </Badge>
            ))}
        </div>
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
      </div>
    </div>
  );
};

export default AdminPost;
