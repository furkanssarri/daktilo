import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  ContentState,
} from "draft-js";
import "draft-js/dist/Draft.css";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
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
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );

  const editorRef = useRef<Editor>(null);

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

  useEffect(() => {
    if (isEdit && initialData?.content) {
      const contentState = ContentState.createFromText(initialData.content);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [isEdit, initialData]);

  // wire SelectCategoryTag with RHF via watch + setValue
  const watchedCategoryId = form.watch("categoryId");
  const watchedTags = form.watch("tags");

  const handleKeyCommand = (
    command: string,
    state: EditorState,
  ): "handled" | "not-handled" => {
    const newState = RichUtils.handleKeyCommand(
      state,
      command,
    ) as EditorState | null;
    if (newState) {
      setEditorState(newState);

      // convert editorState to plain text
      const raw = convertToRaw(newState.getCurrentContent());
      const plain = raw.blocks.map((b) => b.text).join("\n");
      form.setValue("content", plain, { shouldValidate: true });

      return "handled";
    }
    return "not-handled";
  };

  // Toolbar button handler
  const toggleInlineStyle = (style: string) => {
    const newState = RichUtils.toggleInlineStyle(editorState, style);
    if (newState) {
      setEditorState(newState);

      // convert editorState to plain text
      const raw = convertToRaw(newState.getCurrentContent());
      const plain = raw.blocks.map((b) => b.text).join("\n");

      // update RHF form value
      form.setValue("content", plain, { shouldValidate: true });
    }
  };

  // Helper to check if a style is currently active
  const currentStyle = editorState.getCurrentInlineStyle();

  // Updated helper function to toggle block type using latest editorState and focus editor
  // const toggleBlockType = (blockType: string) => {
  //   const newState = RichUtils.toggleBlockType(editorState, blockType);
  //   if (newState) {
  //     setEditorState(newState);

  //     // convert editorState to plain text
  //     const raw = convertToRaw(newState.getCurrentContent());
  //     const plain = raw.blocks.map((b) => b.text).join("\n");
  //     form.setValue("content", plain, { shouldValidate: true });

  //     // focus the editor
  //     if (editorRef.current) {
  //       editorRef.current.focus();
  //     }
  //   }
  // };

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
            <div className="space-y-2">
              <Label>Content</Label>

              <div className="mb-2 flex flex-wrap gap-2">
                {/* Inline styles */}
                <Button
                  type="button"
                  variant={currentStyle.has("BOLD") ? "default" : "outline"}
                  onClick={() => toggleInlineStyle("BOLD")}
                  size="sm"
                >
                  <strong>B</strong>
                </Button>
                <Button
                  type="button"
                  variant={currentStyle.has("ITALIC") ? "default" : "outline"}
                  onClick={() => toggleInlineStyle("ITALIC")}
                  size="sm"
                >
                  <em>I</em>
                </Button>
                <Button
                  type="button"
                  variant={
                    currentStyle.has("UNDERLINE") ? "default" : "outline"
                  }
                  onClick={() => toggleInlineStyle("UNDERLINE")}
                  size="sm"
                >
                  <u>U</u>
                </Button>

                {/* Block types */}
                {/* <Button
                  type="button"
                  onClick={() => toggleBlockType("header-one")}
                  size="sm"
                >
                  H1
                </Button>
                <Button
                  type="button"
                  onClick={() => toggleBlockType("header-two")}
                  size="sm"
                >
                  H2
                </Button>
                <Button
                  type="button"
                  onClick={() => toggleBlockType("blockquote")}
                  size="sm"
                >
                  ❝ Blockquote
                </Button>
                <Button
                  type="button"
                  onClick={() => toggleBlockType("code-block")}
                  size="sm"
                >
                  {"</> Code"}
                </Button> */}
              </div>

              <div className="min-h-[200px] rounded border p-2">
                <Editor
                  ref={editorRef}
                  editorState={editorState}
                  onChange={(state: EditorState) => {
                    setEditorState(state);

                    const raw = convertToRaw(state.getCurrentContent());
                    const plain = raw.blocks.map((b) => b.text).join("\n");
                    form.setValue("content", plain, { shouldValidate: true });
                  }}
                  handleKeyCommand={handleKeyCommand}
                />
              </div>

              {form.formState.errors.content && (
                <FieldError errors={[form.formState.errors.content]} />
              )}
            </div>

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
