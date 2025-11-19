import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SocialButtons } from "@/components/custom/SocialButtons";

import type { PostWithRelations } from "@/types/EntityTypes";
import postApi from "@/api/postApi";

export default function Home() {
  const [posts, setPosts] = useState<PostWithRelations[] | []>([]);

  useEffect(() => {
    postApi
      .getAll()
      .then((data) => setPosts(data))
      .catch((err) => console.error("Failed to fetch the posts: ", err));
  }, []);

  return (
    <div className="mt-5 space-y-24 rounded-sm border">
      {/* Landing Section */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-24 text-center">
        <h1 className="mb-6 text-4xl font-bold sm:text-5xl">
          Hi, I'm Furkan 👋
        </h1>

        <p className="text-muted-foreground mb-4 leading-relaxed">
          I'm on a journey to become a fullstack web developer. I love building
          little projects, trying out new coding techniques, and sharing what I
          learn along the way. When I'm not at my desk, you'll find me reading,
          hiking through the mountains, or challenging myself on rock-climbing
          walls.
        </p>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          I started this blog to document my progress, keep myself accountable,
          and hopefully inspire anyone else who's learning to code. Welcome to
          my corner of the internet, and thanks for stopping by!
        </p>

        {/* Social Buttons */}
        <div className="flex justify-center space-x-4">
          <SocialButtons />
        </div>
      </section>

      <Separator className="mx-auto max-w-4xl" />

      {/* Latest Articles Section */}
      <section className="mx-auto mb-4 max-w-4xl px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Latest Articles</h2>
        </div>

        <div className="flex flex-col space-y-6">
          {posts &&
            Array.isArray(posts) &&
            posts.map((post) => (
              <Card
                key={post.id}
                className="w-full transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <CardTitle>
                    <Link
                      to={`/posts/slug/${post.slug}`}
                      className="text-lg leading-snug font-semibold hover:underline"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Published on{" "}
                    {new Date(post.createdAt).toLocaleDateString("tr")}
                  </p>
                </CardContent>
              </Card>
            ))}

          <Link
            to="#"
            className="text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            View all articles →
          </Link>
        </div>
      </section>
    </div>
  );
}
