import getStartofWeek from "@/utils/getStartofWeek";
import { useMemo } from "react";
import type { Post as PostType } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PostsOverviewPropTypes = {
  allPosts: PostType[] | [];
};

const PostsOverview = ({ allPosts }: PostsOverviewPropTypes) => {
  const postsThisWeek = useMemo(() => {
    const startofWeek = getStartofWeek(new Date());
    return allPosts.filter((post) => new Date(post.createdAt) >= startofWeek);
  }, [allPosts]);

  const newPostsCount = postsThisWeek.length;

  return (
    <Card className="fade-in">
      <CardHeader>
        <CardTitle>Total Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{allPosts.length}</p>
        <Badge variant="secondary" className="mt-2">
          +{newPostsCount} new this week
        </Badge>
      </CardContent>
    </Card>
  );
};

export default PostsOverview;
