import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handle signup logic here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      {/* Header */}
      <section className="text-center mb-12 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Create an Account
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Join <span className="text-primary font-medium">Daktilo</span> and
          start sharing your stories with the world.
        </p>
      </section>

      {/* Signup Card */}
      <Card className="w-full max-w-md p-8 shadow-sm border rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="focus:ring-2 focus:ring-primary"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-medium py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
