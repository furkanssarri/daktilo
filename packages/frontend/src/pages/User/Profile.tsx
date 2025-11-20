import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { UserWithRelations, FrontendComment } from "@/types/EntityTypes";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import userApi from "@/api/userApi";
import CommentCard from "@/components/layout/CommentCard";

const Profile = () => {
  const { isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<UserWithRelations | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      try {
        await userApi.getMe().then((data) => setUserData(data));
      } catch (err) {
        console.error("Failed to fetch the user: ", err);
      }
    };
    load();
  }, []);

  if (!userData) return <div>User not found.</div>;
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      {/* Header */}
      <section className="mb-12 space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Your Profile
        </h1>
        <p className="text-muted-foreground mx-auto max-w-md">
          View and manage your account details and comments.
        </p>
      </section>

      {/* Profile Card */}
      <Card className="mb-12 w-full max-w-2xl rounded-xl border p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
        <div className="flex flex-col items-center space-y-6 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-6">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={userData.avatar?.url || undefined}
              alt={userData.username || undefined}
            />
            <AvatarFallback>{userData?.username?.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3 text-center sm:text-left">
            <h2 className="text-2xl font-semibold">
              {userData.username || ""}
            </h2>
            <p className="text-muted-foreground">{userData.email}</p>
            <p className="text-muted-foreground text-sm">
              Some dummy static content that will soon be replaced with actualy
              dynamic bio content for each user. For the time being, this text
              will be act as a placeholder.
            </p>
            <p className="text-muted-foreground text-xs">
              Joined {new Date(userData.createdAt).toLocaleDateString("tr")}
            </p>

            <div className="flex justify-center gap-3 pt-4 sm:justify-start">
              <Button variant="default">Edit Profile</Button>
              <Button variant="outline">Logout</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* My Comments Section */}
      <section className="w-full max-w-3xl space-y-6">
        <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight sm:text-left">
          My Comment Activity
        </h2>

        {Array.isArray(userData.comments) && userData.comments.length > 0 ? (
          userData.comments.map((comment: FrontendComment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="text-muted-foreground text-center">
            You haven’t left any comments yet.
          </p>
        )}
      </section>
    </main>
  );
};

export default Profile;
