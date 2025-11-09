import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
// import CommentCard from "@/components/custom/CommentCard";
import postApi from "@/api/postApi";

import type { PostWithRelations } from "@/types/EntityTypes";
import type { Comment as CommentType } from "@prisma/client";

type FrontendComment = CommentType & {
  author?: { id: string; username: string; avatar: string | null };
};

const BlogPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [comments, setComments] = useState<FrontendComment[]>([]);

  useEffect(() => {
    if (postId) {
      postApi
        .getById(postId)
        .then((post) => {
          setPost(post);
          console.log(post);
        })
        .catch((err) => console.error("Failed to fetch the post: ", err));
    }
  }, [postId]);

  useEffect(() => {
    if (post) {
      setComments(post.comments ?? []);
    }
    console.log(comments);
  }, [post, comments]);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-center space-y-4">
        <h1 className="text-4xl font-bold">Post Not Found</h1>
        <p className="text-muted-foreground">
          Sorry, we couldn’t find the article you’re looking for.
        </p>
        <Link to="/blog" className="text-primary hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      {/* Header Section */}
      <header className="space-y-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-sm text-muted-foreground">
          <p>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {/* {post.readTime && <p>• {post.readTime} min read</p>} */}
          <p>{post.categoryId}</p>
        </div>
      </header>

      {/* Featured Image */}
      {/* {post.imageUrl && (
        <div className="w-full max-h-[480px] overflow-hidden rounded-lg shadow-sm">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )} */}

      {/* Post Content */}
      <Card className="prose dark:prose-invert max-w-none mx-auto px-8 py-10 leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </Card>

      {/* Comments Section */}
      <section className="max-w-3xl mx-auto mt-12 space-y-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          Comments ({post.comments.length})
        </h2>

        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-4 p-5 bg-card border border-border rounded-xl shadow-sm hover:shadow transition-all duration-200"
            >
              {/* Avatar */}
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarImage
                  src={comment.author?.avatar || "/user.jpg"}
                  alt={comment.author?.username || "Anonymous"}
                />
              </Avatar>

              {/* Comment Body */}
              <div className="flex flex-col space-y-1">
                {/* Username & Date */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <p className="font-medium text-foreground">
                    <Link to={comment.authorId}>
                      {" "}
                      {(comment && comment.author?.username) || "Anonymous"}
                    </Link>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Comment Content */}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No comments yet. Be the first to leave one!
          </p>
        )}
      </section>
      {/* Footer / Back link */}
      <footer className="text-center pt-10">
        <Link
          to="/blog"
          className="text-primary hover:underline font-medium tracking-wide"
        >
          ← Back to All Posts
        </Link>
      </footer>
    </article>
  );
};

export default BlogPost;
