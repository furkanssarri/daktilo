import { Link } from "react-router-dom";

const NotFoundElement = () => {
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
};

export default NotFoundElement;
