import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/card";
import type { Comment as CommentType } from "@prisma/client";

const CommentCard = ({ comment }: { comment: CommentType }) => {
  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 120; // characters before truncation

  const isLong = comment.content.length > MAX_LENGTH;
  const displayText = expanded
    ? comment.content
    : `${comment.content.slice(0, MAX_LENGTH)}${isLong ? "..." : ""}`;

  return (
    <Card className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
        <Link
          to={`/post/${comment.postId}`}
          className="text-lg font-medium text-primary hover:underline"
        ></Link>
        <span className="text-xs text-muted-foreground mt-1 sm:mt-0">
          {new Date(comment.createdAt).toLocaleDateString("tr")}
        </span>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {displayText}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary mt-2 hover:underline"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </Card>
  );
};

export default CommentCard;
