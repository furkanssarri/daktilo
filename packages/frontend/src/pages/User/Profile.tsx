import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import CommentCard from "@/components/custom/CommentCard";
// import type { Comment as CommentType } from "@prisma/client";
// import { useEffect, useState } from "react";
// import userApi from "@/api/userApi";

const Profile = () => {
  // const [userComments, setUserComments] = useState<CommentType[] | []>([]);

  // useEffect(() => {
  //   userApi
  //     .getComments()
  //     .then((data: CommentType[]) => setUserComments(data))
  //     .catch((err) => console.error("Failed to fetch user comments: ", err));
  // }, []);

  // Example static user data
  const user = {
    name: "Furkan Sarı",
    email: "furkan@example.com",
    bio: "Frontend developer and writer passionate about clean UI, web performance, and modern design systems.",
    joinedAt: "March 2024",
    avatarUrl: "/assets/avatar-placeholder.jpg",
  };

  // Example static comments data
  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      {/* Header */}
      <section className="text-center mb-12 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Your Profile
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          View and manage your account details and comments.
        </p>
      </section>

      {/* Profile Card */}
      <Card className="w-full max-w-2xl p-8 shadow-sm border rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-md mb-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-6 sm:space-y-0">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3 text-center sm:text-left">
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">{user.bio}</p>
            <p className="text-xs text-muted-foreground">
              Joined {user.joinedAt}
            </p>

            <div className="pt-4 flex justify-center sm:justify-start gap-3">
              <Button variant="default">Edit Profile</Button>
              <Button variant="outline">Logout</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* My Comments Section */}
      <section className="w-full max-w-3xl space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight mb-2 text-center sm:text-left">
          My Comments
        </h2>

        {/* {userComments.length > 0 ? (
          userComments.map((comment: CommentType) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            You haven’t left any comments yet.
          </p>
        )} */}
      </section>
    </main>
  );
};

export default Profile;
