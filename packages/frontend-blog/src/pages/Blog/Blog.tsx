import { SocialButtons } from "@/components/custom/SocialButtons";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link } from "react-router-dom";
import type {
  Category as CategoryType,
  Post as PostType,
} from "@prisma/client";
import postApi from "@/api/postApi";
import categoryApi from "@/api/categoryApi";
import { useEffect, useState } from "react";

const Blog = () => {
  const [allPosts, setAllPosts] = useState<PostType[] | []>([]);
  const [recentPosts, setRecentPosts] = useState<PostType[] | []>([]);
  const [categories, setCategories] = useState<CategoryType[] | []>([]);

  useEffect(() => {
    postApi
      .getAll()
      .then((data: PostType[]) => {
        setAllPosts(data);
      })
      .catch((err) => console.error("Error fetching posts: ", err));
  }, []);

  useEffect(() => {
    categoryApi
      .getAll()
      .then((data: CategoryType[]) => setCategories(data))
      .catch((err) => console.error("Error fetching categories: ", err));
  }, []);

  useEffect(() => {
    const latestPosts = allPosts
      .sort(
        (a: PostType, b: PostType) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 3);
    setRecentPosts(latestPosts);
  }, [allPosts]);

  return (
    <main className="mx-auto max-w-5xl space-y-16 px-6 py-16">
      {/* Hero  Section */}
      <section className="space-y-4 text-center">
        <h1 className="text-5xl font-bold">Blog</h1>
        <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
          Explore my latest projects, tutorials, and insights on web
          development.
        </p>
      </section>

      <Separator />

      {/* Recent Posts (Optional)  */}
      <section className="grid gap-8 md:grid-cols-2">
        {Array.isArray(recentPosts) &&
          recentPosts.map((post: PostType) =>
            post ? (
              <Card
                key={post.id}
                className="group cursor-pointer transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle>
                    <Link
                      to={`/posts/id/${post.id}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {/* {post.createdAt.toLocaleDateString()} */}
                    {/* • post.readTime ? ({post.readTime} min read) */}
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
        {Array.isArray(allPosts) &&
          allPosts.map((post: PostType) =>
            post ? (
              <Card
                key={post.id}
                className="flex w-full flex-row overflow-hidden transition-shadow duration-200 hover:shadow-md"
              >
                <Link
                  to={`/blog/${post.slug ?? post.id}`}
                  className="flex w-full flex-row text-inherit hover:no-underline"
                >
                  {/* LEFT SIDE — TEXT CONTENT */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <CardTitle className="text-primary mb-3 text-2xl font-semibold hover:underline">
                        {post.title}
                      </CardTitle>

                      <p className="text-muted-foreground hover:text-foreground mb-4 line-clamp-3 transition-colors duration-200">
                        {post.excerpt}
                      </p>
                    </div>

                    <p className="text-muted-foreground text-sm">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      {/* {post.readTime ? ` • ${post.readTime} min read` : ""} */}
                    </p>
                  </div>

                  {/* RIGHT SIDE — IMAGE */}
                  {/* {post.imageUrl && (
                  <div className="w-1/3 relative">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )} */}
                </Link>
              </Card>
            ) : null,
          )}
      </section>

      {/* Categories Section */}
      <section className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold">Categories</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(categories) &&
            categories.map((cat: CategoryType) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="group hover:bg-muted block rounded-lg border p-5 transition-colors duration-200"
              >
                <h3 className="text-primary mb-1 text-lg font-semibold group-hover:underline">
                  {cat.name}
                </h3>
                <p className="text-muted-foreground line-clamp-3 text-sm">
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
