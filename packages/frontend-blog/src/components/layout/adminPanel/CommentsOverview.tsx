import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import type { Comment as CommentType } from "@prisma/client";

type CommentsOverviewPropTypes = {
  allComments: CommentType[] | [];
};

const CommentsOverview = ({ allComments }: CommentsOverviewPropTypes) => {
  const unApproved = useMemo(() => {
    return allComments.filter((comment) => comment.isApproved === false);
  }, [allComments]);
  return (
    <Card className="fade-in delay-2">
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{allComments.length}</p>
        <Badge variant="secondary" className="mt-2">
          {unApproved.length} awaiting approval
        </Badge>
      </CardContent>
    </Card>
  );
};

export default CommentsOverview;
