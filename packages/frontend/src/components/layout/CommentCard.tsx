import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Card } from "@/components/ui/card";
import type { FrontendComment } from "@/types/EntityTypes";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type CommentCardProps = {
  comment: FrontendComment;
  commentToEdit?: FrontendComment | null;
  setCommentToEdit?: Dispatch<SetStateAction<FrontendComment | null>>;
  editedContent?: string;
  setEditedContent?: Dispatch<SetStateAction<string>>;
  handleEditComment?: () => Promise<void>;
  handleDeleteComment?: (commentId: string) => Promise<void>;
};

const CommentCard = ({
  comment,
  commentToEdit = null,
  setCommentToEdit,
  editedContent,
  setEditedContent,
  handleEditComment,
  handleDeleteComment,
}: CommentCardProps) => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 120; // characters before truncation

  const canEdit =
    setCommentToEdit &&
    setEditedContent &&
    typeof editedContent === "string" &&
    typeof handleEditComment === "function";

  const canDelete = typeof handleDeleteComment === "function";

  const isLong = comment.content.length > MAX_LENGTH;
  const displayText = expanded
    ? comment.content
    : `${comment.content.slice(0, MAX_LENGTH)}${isLong ? "..." : ""}`;

  return (
    <>
      <Card className="rounded-lg border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="mb-2 flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <Link
            to={`/post/${comment.postId}`}
            className="text-primary text-lg font-medium hover:underline"
          ></Link>
          <span className="text-muted-foreground mt-1 text-xs sm:mt-0">
            {new Date(comment.createdAt).toLocaleDateString("tr")}
          </span>
        </div>

        <Avatar className="h-12 w-12 shrink-0">
          <AvatarImage
            src={comment.author?.avatar || "/user.jpg"}
            alt={comment.author?.username || "Anonymous"}
          />
        </Avatar>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {displayText}
        </p>

        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary mt-2 text-xs hover:underline"
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </Card>
      {user?.id === comment.authorId && (
        <div className="flex justify-end gap-2">
          {canEdit && (
            <Dialog
              open={commentToEdit?.id === comment.id}
              onOpenChange={(open) => {
                if (!open && setCommentToEdit && setEditedContent) {
                  setCommentToEdit(null);
                  setEditedContent("");
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!canEdit) return;
                    setCommentToEdit(comment);
                    setEditedContent(comment.content);
                  }}
                >
                  Edit
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Comment</DialogTitle>
                  <DialogDescription>
                    Update your comment below.
                  </DialogDescription>
                </DialogHeader>

                {canEdit && (
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                )}

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleEditComment}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this comment? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteComment?.(comment.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </>
  );
};

export default CommentCard;
