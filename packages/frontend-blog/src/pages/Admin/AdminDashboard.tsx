import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

import adminPostsApi from "@/api/adminApi/adminPostApi";
import adminCommentsApi from "@/api/adminApi/adminCommentsApi";
import adminUserApi from "@/api/adminApi/AdminUserApi";
import OverviewSection from "@/components/layout/adminPanel/OverviewSection";
import type { Post as PostType, Comment as CommentType } from "@prisma/client";
import type { UserWithRelations } from "@/types/EntityTypes";
import ManagePostsSection from "@/components/layout/adminPanel/ManagePostsSection";

const AdminDashboard = () => {
  const users = useScrollFadeIn();

  const [allPosts, setAllPosts] = useState<PostType[] | []>([]);
  const [allComments, setAllComments] = useState<CommentType[] | []>([]);
  const [allUsers, setAllUsers] = useState<UserWithRelations[] | []>([]);

  useEffect(() => {
    adminPostsApi
      .getAll()
      .then((data: PostType[]) => setAllPosts(data))
      .catch((err) => console.error("Failed fetching posts: ", err));
  }, []);

  useEffect(() => {
    adminCommentsApi
      .getAll()
      .then((data: CommentType[]) => setAllComments(data))
      .catch((err) => console.error("Failed fetching comments: ", err));
  }, []);

  useEffect(() => {
    adminUserApi
      .getAllUsers()
      .then((data: UserWithRelations[]) => setAllUsers(data))
      .catch((err) => console.error("Failed to fetch all users: ", err));
  }, []);

  return (
    <div className="mx-auto mt-5 max-w-5xl space-y-24 rounded-sm border px-6 py-16">
      {/* Header / Intro Section */}
      <section className="flex flex-col items-center space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold sm:text-5xl">Admin Dashboard</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Welcome back, Furkan 👋 — manage your content, review user activity,
            and keep your blog running smoothly.
          </p>
        </div>
      </section>

      <Separator />

      {/* Overview Section */}
      <OverviewSection
        allPosts={allPosts}
        allComments={allComments}
        allUsers={allUsers}
      />

      <Separator />

      {/* Manage Posts Section */}
      <ManagePostsSection allPosts={allPosts} />

      <Separator />

      {/* Manage Users Section */}
      <section
        ref={users.ref}
        className={`scroll-fade space-y-6 ${users.isVisible ? "visible" : ""}`}
      >
        <h2 className="text-2xl font-semibold">User Management</h2>
        <p className="text-muted-foreground">
          View registered users, moderate their comments, or manage roles.
        </p>

        <div className="space-y-4">
          <Card className="transition hover:shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>@berata</CardTitle>
              <Badge variant="secondary">User</Badge>
            </CardHeader>
            <CardContent className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                View Activity
              </Button>
              <Button variant="destructive" size="sm">
                Ban
              </Button>
            </CardContent>
          </Card>

          <Card className="transition hover:shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>@fikosa</CardTitle>
              <Badge variant="outline">Admin</Badge>
            </CardHeader>
            <CardContent className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                View Activity
              </Button>
              <Button variant="destructive" size="sm" disabled>
                Ban
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
