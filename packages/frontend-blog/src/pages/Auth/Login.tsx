import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { type LoginFormValues, loginSchema } from "@/validators/authValidators";
import { zodResolver } from "@hookform/resolvers/zod";
import authApi from "@/api/authApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const Login = () => {
  const navigate = useNavigate(); // hook for redirecting after login
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setSuccess("");

    try {
      const res = await authApi.login(values);
      // assuming apiRequest() returns the parsed JSON from backend
      if (
        res.status === "success" &&
        res.data?.accessToken &&
        res.data?.refreshToken
      ) {
        setSuccess(res.message || "Login successfull!");
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        window.dispatchEvent(new Event("auth-change"));
        navigate("/users/me");
      } else {
        setServerError(res.message || "Login failed.");
        console.error("Login failed:", res.message);
      }
    } catch (err) {
      console.error("Error logging in:", err);
      const message =
        err instanceof Error ? err.message : "Unexpected error occured.";
      setServerError(message);
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
          <span className="inline-block bg-linear-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent transition-all duration-300 hover:from-purple-500 hover:to-indigo-500">
            Daktilo
          </span>
          .
        </p>
      </section>

      {/* Login Card */}
      <Card className="w-full max-w-md rounded-xl border p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle>Signin to your account.</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="login-form"
            className="flex flex-col space-y-6"
            noValidate
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="login-email"
                      placeholder="you@example.com"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="login-password"
                      placeholder="Your password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {/* Server errors */}
            {serverError && (
              <p className="text-sm text-red-500">{serverError}</p>
            )}
            {success && <p className="text-sm text-green-500">{success}</p>}

            <Button
              type="submit"
              className="bg-primary text-primary-foreground w-full rounded-md py-2 font-medium transition-opacity hover:opacity-90"
            >
              Sign In
            </Button>
          </form>
        </CardContent>

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
