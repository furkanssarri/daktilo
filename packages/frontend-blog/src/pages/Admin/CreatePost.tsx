import PostForm from "@/components/layout/adminPanel/PostForm";

const CreatePost = () => {
  return (
    <div className="mx-auto max-w-4xl py-10">
      <PostForm mode="create" />
    </div>
  );
};

export default CreatePost;
