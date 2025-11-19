import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BlogCardProps {
  title: string;
  author: string;
  excerpt: string;
  avatar?: string;
}

export function BlogCard({ title, author, excerpt, avatar }: BlogCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex items-center gap-3">
        <Avatar>
          {avatar ? (
            <AvatarImage src={avatar} />
          ) : (
            <AvatarFallback>{author[0]}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">by {author}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{excerpt}</p>
      </CardContent>
    </Card>
  );
}
