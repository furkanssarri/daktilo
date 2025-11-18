// packages/frontend-blog/src/components/layout/adminPanel/PostForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import SelectCategoryTag from "@/components/layout/adminPanel/SelectCategoryTag";
import adminPostsApi from "@/api/adminApi/adminPostApi";

import type {
  CreatePostFormData,
  PostWithRelations,
} from "@/types/EntityTypes";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

// type SchemaOutput = z.infer<typeof postSchema>;

// // This checks compatibility without mutating the Zod type
// type _Check = SchemaOutput extends CreatePostFormData
//   ? CreatePostFormData extends SchemaOutput
//     ? true
//     : never
//   : never;

/**
 * Validation schema.
 * IMPORTANT: we do NOT assert the internal shape of tags or other Prisma types here.
 * Instead we describe the same keys your CreatePostFormData contains, and cast
 * the Zod type to `CreatePostFormData` so TypeScript continues to use your original types.
 */
const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().nullable().optional(),
  content: z.string().min(1, "Content is required"),
  imageId: z.string().nullable().optional(),
  categoryId: z.string().optional().nullable(),
  // keep tags as unknown to avoid changing your Tag type
  tags: z.array(z.any()),
});

type CreateProps = {
  mode: "create";
  initialData?: undefined;
};

type EditProps = {
  mode: "edit";
  initialData: PostWithRelations;
};

type PostFormProps = CreateProps | EditProps;

const PostForm = ({ mode, initialData }: PostFormProps) => {
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  // keep file out of form values (files aren't serializable)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // build defaults from initialData but preserve your exact CreatePostFormData types
  const defaultValues: CreatePostFormData = {
    title: isEdit ? initialData.title : "",
    excerpt: isEdit ? (initialData.excerpt ?? "") : "",
    content: isEdit ? initialData.content : "",
    imageId: isEdit ? (initialData.imageId ?? undefined) : undefined,
    categoryId: isEdit ? (initialData.categoryId ?? null) : null,
    tags: isEdit ? initialData.tags : [],
  };

  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues,
    mode: "onTouched",
  });

  // helper: build payload matching CreatePostFormData (typed)
  const buildPayload = async (
    values: CreatePostFormData,
  ): Promise<CreatePostFormData> => {
    const payload: CreatePostFormData = {
      title: values.title,
      excerpt: values.excerpt,
      content: values.content,
      imageId: values.imageId,
      categoryId: values.categoryId,
      tags: values.tags,
    };

    if (imageFile) {
      const uploaded = await adminPostsApi.uploadImage(imageFile);
      payload.imageId = uploaded.id;
    }

    return payload;
  };

  const onSubmit = async (values: CreatePostFormData) => {
    setIsLoading(true);
    try {
      const payload = await buildPayload(values);

      if (isEdit) {
        if (!initialData) throw new Error("Missing initial data for edit");
        const updated = await adminPostsApi.update(initialData.slug, payload);
        navigate(`/admin/posts/slug/${updated?.slug}`);
      } else {
        const created = await adminPostsApi.create(payload);
        navigate(`/admin/posts/slug/${created?.slug}`);
      }
    } catch (err) {
      console.error("Post save error:", err);
      // show server error UI here if you want
    } finally {
      setIsLoading(false);
    }
  };

  // wire SelectCategoryTag with RHF via watch + setValue
  const watchedCategoryId = form.watch("categoryId");
  const watchedTags = form.watch("tags");

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Post" : "Create New Post"}</CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-8 py-6">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Title */}
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    id="title"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    required
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Excerpt */}
            <Controller
              name="excerpt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="excerpt">Excerpt</FieldLabel>
                  <Input
                    id="excerpt"
                    {...field}
                    value={field.value ?? ""}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Image file input (local state) */}
            <div className="space-y-2">
              <Label htmlFor="imageFile">Image</Label>
              <Input
                id="imageFile"
                name="imageFile"
                type="file"
                onChange={(e) => {
                  const file =
                    (e.target as HTMLInputElement).files?.[0] ?? null;
                  setImageFile(file);
                }}
              />
              {form.getValues("imageId") && (
                <p className="text-muted-foreground text-sm">
                  Current image id: {String(form.getValues("imageId"))}
                </p>
              )}
            </div>

            {/* Content */}
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" {...field} className="h-100" />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Category & Tags */}
            <div>
              <SelectCategoryTag
                selectedCategory={watchedCategoryId ?? null}
                selectedTags={watchedTags ?? []}
                onCategoryChange={(categoryId) =>
                  form.setValue("categoryId", categoryId ?? null, {
                    shouldValidate: true,
                  })
                }
                onTagsChange={(tags) =>
                  form.setValue("tags", tags ?? [], { shouldValidate: true })
                }
              />
            </div>
          </FieldGroup>
          <CardFooter className="flex justify-end py-4">
            <Button
              type="submit"
              disabled={isLoading || form.formState.isSubmitting}
            >
              {isLoading || form.formState.isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Update Post"
                  : "Create Post"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostForm;
