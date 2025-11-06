import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-muted-foreground">
        Oops — the page you’re looking for doesn’t exist.
      </p>
      <Link to="/" className="text-primary hover:underline">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
