import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import type {
  Post as PostType,
  Comment as CommentType,
  User as UserType,
} from "@prisma/client";
import PostsOverview from "./PostsOverview";
import CommentsOverview from "./CommentsOverview";
import UsersOverview from "./UsersOverview";

type OverviewSectionPropTypes = {
  allPosts: PostType[] | [];
  allComments: CommentType[] | [];
  allUsers: UserType[] | [];
};

const OverviewSection = ({
  allPosts,
  allComments,
  allUsers,
}: OverviewSectionPropTypes) => {
  const overview = useScrollFadeIn();

  return (
    <>
      <section
        ref={overview.ref}
        className={`scroll-fade space-y-6 ${overview.isVisible ? "visible" : ""}`}
      >
        <h2 className="text-2xl font-semibold">Quick Overview</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PostsOverview allPosts={allPosts} />

          <CommentsOverview allComments={allComments} />
          <UsersOverview allUsers={allUsers} />
        </div>
      </section>
    </>
  );
};

export default OverviewSection;
