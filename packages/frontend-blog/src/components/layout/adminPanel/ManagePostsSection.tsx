import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import type { Post as PostType } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";

type ManagePostsSectionPropTypes = {
  allPosts: PostType[] | [];
};

const ManagePostsSection = ({ allPosts }: ManagePostsSectionPropTypes) => {
  const posts = useScrollFadeIn();
  const navigate = useNavigate();

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
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>
    </section>
  );
};

export default ManagePostsSection;
