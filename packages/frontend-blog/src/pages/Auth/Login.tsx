import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import authApi from "@/api/authApi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // hook for redirecting after login

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await authApi.login({ email, password });
      // assuming apiRequest() returns the parsed JSON from backend
      if (
        res.status === "success" &&
        res.data?.accessToken &&
        res.data?.refreshToken
      ) {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        window.dispatchEvent(new Event("auth-change"));
        navigate("/users/me");
      } else {
        console.error("Login failed:", res.message);
      }
    } catch (err) {
      console.error("Error logging in:", err);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      {/* Header */}
      <section className="mb-12 space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome Back
        </h1>
        <p className="text-muted-foreground mx-auto max-w-md">
          Sign in to continue your journey with{" "}
          <span className="text-primary font-medium">Daktilo</span>.
        </p>
      </section>

      {/* Login Card */}
      <Card className="w-full max-w-md rounded-xl border p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-muted-foreground mb-1 block text-sm font-medium"
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
              className="focus:ring-primary focus:ring-2"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-muted-foreground mb-1 block text-sm font-medium"
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
              className="focus:ring-primary focus:ring-2"
            />
          </div>

          <Button
            type="submit"
            className="bg-primary text-primary-foreground w-full rounded-md py-2 font-medium transition-opacity hover:opacity-90"
          >
            Sign In
          </Button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
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
