import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handle login logic here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      {/* Header */}
      <section className="text-center mb-12 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Welcome Back
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Sign in to continue your journey with{" "}
          <span className="text-primary font-medium">Daktilo</span>.
        </p>
      </section>

      {/* Login Card */}
      <Card className="w-full max-w-md p-8 shadow-sm border rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Email address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus:ring-2 focus:ring-primary"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-medium py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don’t have an account?{" "}
          <Link to="/auth/signup" className="text-primary hover:underline">
            Create one
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
