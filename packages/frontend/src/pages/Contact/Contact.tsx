import { useState } from "react";
import contactApi from "@/api/contactApi";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  contactSchema,
  type ContactFormValues,
} from "@/validators/authValidators";

const Contact = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: ContactFormValues) => {
    setServerError(null);
    setSuccess("");

    try {
      const res = await contactApi.sendMessage(values);

      if (res.status === "success") {
        setSuccess("Your message has been sent! Thank you ♥");
        toast.success("Your message has been sent!");
        form.reset();
      } else {
        setServerError(res.message || "Something went wrong.");
        toast.error(res.message || "Something went wrong.");
      }
    } catch (err: unknown) {
      console.error("Contact form error:", err);
      const message =
        err instanceof Error ? err.message : "Unexpected error occurred";
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div className="mt-5 space-y-24">
      {/* Intro Section */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-10 text-center">
        <h1 className="mb-6 text-4xl font-bold sm:text-5xl">Let’s Connect</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          I’d love to hear from you — whether you have a question, a project
          idea, or just want to chat about web development.
        </p>
      </section>

      {/* Contact Card */}
      <section className="mx-auto max-w-2xl px-6 pb-24">
        <Card className="rounded-xl border p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>
              I'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-6"
              noValidate
            >
              <FieldGroup>
                {/* Name */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="contact-name">Name</FieldLabel>
                      <Input
                        {...field}
                        id="contact-name"
                        placeholder="Your name"
                        aria-invalid={fieldState.invalid}
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
                      <FieldLabel htmlFor="contact-email">Email</FieldLabel>
                      <Input
                        {...field}
                        id="contact-email"
                        type="email"
                        placeholder="you@example.com"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Message */}
                <Controller
                  name="message"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="contact-message">Message</FieldLabel>
                      <textarea
                        {...field}
                        id="contact-message"
                        rows={6}
                        placeholder="Your message..."
                        className="bg-background focus:ring-primary rounded-md border p-3 outline-none focus:ring-2"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              {/* Server Feedback */}
              {serverError && (
                <p className="text-sm text-red-500">{serverError}</p>
              )}
              {success && <p className="text-sm text-green-500">{success}</p>}

              <Button
                type="submit"
                className="bg-primary text-primary-foreground w-full rounded-md py-3 font-medium hover:opacity-90"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Contact;
