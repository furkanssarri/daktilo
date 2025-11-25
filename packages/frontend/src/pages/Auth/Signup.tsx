import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

import authApi from "@/api/authApi";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signupSchema,
  type SignupFormValues,
} from "@/validators/authValidators";

// -------------------- COMPONENT --------------------
const Signup = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  // -------------------- SUBMIT HANDLER --------------------
  const onSubmit = async (values: SignupFormValues) => {
    setServerError(null);
    setSuccess("");

    try {
      const res = await authApi.signup(values);

      if (res.status === "success") {
        setSuccess(res.message || "Signup successful!");
        navigate("/auth/login");
      } else {
        setServerError(res.message || "Signup failed.");
      }
    } catch (err: unknown) {
      console.error("Signup error:", err);
      const message =
        err instanceof Error ? err.message : "Unexpected error occurred";
      setServerError(message);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      {/* Header */}
      <section className="mb-12 space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Create an Account
        </h1>
        <p className="text-muted-foreground mx-auto max-w-md">
          Join{" "}
          <span className="inline-block bg-linear-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent transition-all duration-300 hover:from-purple-500 hover:to-indigo-500">
            Daktilo
          </span>{" "}
          and start enjoying this little community.
        </p>
      </section>

      {/* Signup Card */}
      <Card className="w-full max-w-md rounded-xl border p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle>Create account for free</CardTitle>
          <CardDescription>
            An account is required for interacting with posts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="signup-form"
            className="flex flex-col space-y-6"
            noValidate
          >
            {/* Username */}
            <FieldGroup>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-form-username">
                      Username
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-form-username"
                      aria-invalid={fieldState.invalid}
                      placeholder="Your username..."
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-form-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="signup-form-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="you@example.com"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-form-password">
                      {" "}
                      Password{" "}
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="signup-form-password"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="Your password..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-2 flex items-center text-sm"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
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
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing up…" : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <p className="text-muted-foreground mt-6 text-center text-sm">
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
