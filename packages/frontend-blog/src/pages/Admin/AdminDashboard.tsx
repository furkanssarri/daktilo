import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

import adminPostsApi from "@/api/adminApi/adminPostApi";
import adminCommentsApi from "@/api/adminApi/adminCommentsApi";
import { useEffect, useMemo, useState } from "react";
import type { Post as PostType, Comment as CommentType } from "@prisma/client";
import type { UserWithRelations } from "@/types/EntityTypes";
import adminUserApi from "@/api/adminApi/AdminUserApi";

const AdminDashboard = () => {
  const overview = useScrollFadeIn();
  const posts = useScrollFadeIn();
  const users = useScrollFadeIn();

  // ---------- ALL POSTS LOGIC --------------------------
  const [allPosts, setAllPosts] = useState<PostType[] | []>([]);

  useEffect(() => {
    adminPostsApi
      .getAll()
      .then((data: PostType[]) => setAllPosts(data))
      .catch((err) => console.error("Failed fetching posts: ", err));
  }, []);

  const getStartofWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const postsThisWeek = useMemo(() => {
    const startofWeek = getStartofWeek(new Date());
    return allPosts.filter((post) => new Date(post.createdAt) >= startofWeek);
  }, [allPosts]);

  const newPostsCount = postsThisWeek.length;

  // ---------- ALL COMMENTS LOGIC -------------------

  const [allComments, setAllComments] = useState<CommentType[] | []>([]);

  useEffect(() => {
    adminCommentsApi
      .getAll()
      .then((data: CommentType[]) => setAllComments(data))
      .catch((err) => console.error("Failed fetching comments: ", err));
  }, []);

  const unApproved = useMemo(() => {
    return allComments.filter((comment) => comment.isApproved === false);
  }, [allComments]);

  // ---------------ALL USERS LOGIC ------------------

  const [allUsers, setAllUsers] = useState<UserWithRelations[] | []>([]);

  const usersThisWeek = useMemo(() => {
    const startofWeek = getStartofWeek(new Date());
    return allUsers.filter((user) => new Date(user.createdAt) >= startofWeek);
  }, [allUsers]);

  const newUsersCount = usersThisWeek.length;

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
      <section
        ref={overview.ref}
        className={`scroll-fade space-y-6 ${overview.isVisible ? "visible" : ""}`}
      >
        <h2 className="text-2xl font-semibold">Quick Overview</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

          <Card className="fade-in delay-3">
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {allUsers && allUsers.length}
              </p>
              <Badge variant="secondary" className="mt-2">
                +{newUsersCount} new this week
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Manage Posts Section */}
      <section
        ref={posts.ref}
        className={`scroll-fade space-y-6 ${posts.isVisible ? "visible" : ""}`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Manage Posts</h2>
          <Button variant="default">+ New Post</Button>
        </div>
        <p className="text-muted-foreground">
          View, edit, or delete existing posts.
        </p>

        <div className="space-y-4">
          <Card className="transition hover:shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Building a REST API with Node.js</CardTitle>
              <Badge variant="outline">Published</Badge>
            </CardHeader>
            <CardContent className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </CardContent>
          </Card>

          <Card className="transition hover:shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Understanding React Hooks</CardTitle>
              <Badge variant="secondary">Draft</Badge>
            </CardHeader>
            <CardContent className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

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
