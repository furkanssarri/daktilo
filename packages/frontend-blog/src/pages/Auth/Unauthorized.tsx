import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <h1 className="mb-4 text-3xl font-bold">Unauthorized</h1>
      <p className="text-muted-foreground mb-6">
        You do not have permission to view this page.
      </p>

      <Link to="/" className="text-primary underline">
        Go back home
      </Link>
    </div>
  );
}
