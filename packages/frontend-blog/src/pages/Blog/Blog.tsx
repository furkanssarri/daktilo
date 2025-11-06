import { SocialButtons } from "@/components/custom/SocialButtons";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link } from "react-router-dom";
import data from "@/data.json";
import categoryData from "@/categories.json";
import type { PostType } from "@/types/PostTypes";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

const Blog = () => {
  const recentPosts: PostType[] = [];
  const allPosts: PostType[] = data.posts;
  const categories: Category[] = categoryData.categories;

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 space-y-16">
      {/* Hero  Section */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-bold">Blog</h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Explore my latest projects, tutorials, and insights on web
          development.
        </p>
      </section>

      <Separator />

      {/* Recent Posts (Optional)  */}
      <section className="grid md:grid-cols-2 gap-8">
        {recentPosts.map((post: PostType) =>
          post ? (
            <Card
              key={post.id}
              className="group hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <CardTitle>
                  <Link to={post.id} className="hover:underline">
                    {post.title}
                  </Link>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {post.createdAt} • post.readTime ? ({post.readTime} min read)
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
              </CardContent>
            </Card>
          ) : null,
        )}
      </section>

      {/* Full Blog List */}
      <section className="flex flex-col space-y-6">
        {allPosts.map((post: PostType) =>
          post ? (
            <Card
              key={post.id}
              className="flex flex-row w-full overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <Link
                to={`/blog/${post.slug ?? post.id}`}
                className="flex flex-row w-full hover:no-underline text-inherit"
              >
                {/* LEFT SIDE — TEXT CONTENT */}
                <div className="flex flex-col justify-between flex-1 p-6">
                  <div>
                    <CardTitle className="text-2xl font-semibold text-primary hover:underline mb-3">
                      {post.title}
                    </CardTitle>

                    <p className="text-muted-foreground line-clamp-3 mb-4 hover:text-foreground transition-colors duration-200">
                      {post.excerpt}
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {post.readTime ? ` • ${post.readTime} min read` : ""}
                  </p>
                </div>

                {/* RIGHT SIDE — IMAGE */}
                {post.imageUrl && (
                  <div className="w-1/3 relative">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </Link>
            </Card>
          ) : null,
        )}
      </section>

      {/* Categories Section */}
      <section className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold">Categories</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat: Category) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group block border rounded-lg p-5 hover:bg-muted transition-colors duration-200"
            >
              <h3 className="text-lg font-semibold text-primary group-hover:underline mb-1">
                {cat.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <SocialButtons />
    </main>
  );
};

export default Blog;
