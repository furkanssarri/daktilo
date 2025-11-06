import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SocialButtons } from "@/components/custom/SocialButtons";

export default function Home() {
  const dummyPosts = [
    {
      title: "Understanding React Context in 2025",
      date: "03/11/2025",
    },
    {
      title: "A Beginner's Guide to TypeScript for Web Developers",
      date: "29/10/2025",
    },
    {
      title: "Why You Should Learn Tailwind CSS This Year",
      date: "15/09/2025",
    },
  ];

  return (
    <div className="space-y-24 border rounded-sm mt-5">
      {/* Landing Section */}
      <section className="max-w-3xl mx-auto text-center pt-16 pb-24 px-6">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Hi, I'm Furkan 👋
        </h1>

        <p className="text-muted-foreground leading-relaxed mb-4">
          I'm on a journey to become a fullstack web developer. I love building
          little projects, trying out new coding techniques, and sharing what I
          learn along the way. When I'm not at my desk, you'll find me reading,
          hiking through the mountains, or challenging myself on rock-climbing
          walls.
        </p>

        <p className="text-muted-foreground leading-relaxed mb-8">
          I started this blog to document my progress, keep myself accountable,
          and hopefully inspire anyone else who's learning to code. Welcome to
          my corner of the internet, and thanks for stopping by!
        </p>

        {/* Social Buttons */}
        <div className="flex justify-center space-x-4">
          <SocialButtons />
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Latest Articles Section */}
      <section className="max-w-4xl mx-auto px-6 mb-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Latest Articles</h2>
          <Link
            to="#"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            View all articles →
          </Link>
        </div>

        <div className="flex flex-col space-y-6">
          {dummyPosts.map((post) => (
            <Card
              key={post.title}
              className="w-full hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle>
                  <Link
                    to="#"
                    className="hover:underline text-lg font-semibold leading-snug"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Published on {post.date}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
