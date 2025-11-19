import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostForm from "@/components/layout/adminPanel/PostForm";
import type { Post as PostType } from "@prisma/client";

// Mock the adminPostsApi
vi.mock("@/api/adminApi/adminPostApi", () => ({
  default: {
    create: vi.fn(),
    update: vi.fn(),
    uploadImage: vi.fn(),
  },
}));

import adminPostsApi from "@/api/adminApi/adminPostApi";

describe("PostForm Component", () => {
  const mockPostData: PostType = {
    id: "post-123",
    title: "Existing Post Title",
    content: "Existing post content",
    excerpt: "Existing post excerpt",
    slug: "existing-post-slug",
    authorId: "author-123",
    imageId: null,
    categoryId: null,
    isPublished: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-02"),
    publishedAt: new Date("2024-01-02"),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Edit Mode", () => {
    it("should correctly initialize with provided initialData", () => {
      render(<PostForm mode="edit" initialData={mockPostData} />);

      // Check if the form elements are initialized with the correct values
      const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
      const excerptInput = screen.getByLabelText(
        /excerpt/i,
      ) as HTMLInputElement;
      const contentTextarea = screen.getByLabelText(
        /content/i,
      ) as HTMLTextAreaElement;

      expect(titleInput.value).toBe("Existing Post Title");
      expect(excerptInput.value).toBe("Existing post excerpt");
      expect(contentTextarea.value).toBe("Existing post content");
    });

    it('should display "Edit Post" title in edit mode', () => {
      render(<PostForm mode="edit" initialData={mockPostData} />);

      expect(screen.getByText("Edit Post")).toBeInTheDocument();
    });

    it('should display "Update Post" button text in edit mode', () => {
      render(<PostForm mode="edit" initialData={mockPostData} />);

      expect(
        screen.getByRole("button", { name: /update post/i }),
      ).toBeInTheDocument();
    });

    it("should handle null excerpt in initialData", () => {
      const postWithNullExcerpt: PostType = {
        ...mockPostData,
        excerpt: null,
      };

      render(<PostForm mode="edit" initialData={postWithNullExcerpt} />);

      const excerptInput = screen.getByLabelText(
        /excerpt/i,
      ) as HTMLInputElement;
      expect(excerptInput.value).toBe("");
    });

    it("should call adminPostsApi.update with correct slug and data on submit", async () => {
      const user = userEvent.setup();
      (adminPostsApi.update as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockPostData,
      );

      render(<PostForm mode="edit" initialData={mockPostData} />);

      // Modify the title
      const titleInput = screen.getByLabelText(/title/i);
      await user.clear(titleInput);
      await user.type(titleInput, "Updated Title");

      // Submit the form
      const submitButton = screen.getByRole("button", { name: /update post/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(adminPostsApi.update).toHaveBeenCalledWith(
          "existing-post-slug",
          expect.objectContaining({
            title: "Updated Title",
            content: "Existing post content",
            excerpt: "Existing post excerpt",
          }),
        );
      });
    });

    it("should preserve all form values when editing", async () => {
      const user = userEvent.setup();
      (adminPostsApi.update as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockPostData,
      );

      render(<PostForm mode="edit" initialData={mockPostData} />);

      // Check all inputs have the correct initial values
      const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
      const excerptInput = screen.getByLabelText(
        /excerpt/i,
      ) as HTMLInputElement;
      const contentTextarea = screen.getByLabelText(
        /content/i,
      ) as HTMLTextAreaElement;

      expect(titleInput.value).toBe(mockPostData.title);
      expect(excerptInput.value).toBe(mockPostData.excerpt);
      expect(contentTextarea.value).toBe(mockPostData.content);

      // Modify content
      await user.clear(contentTextarea);
      await user.type(contentTextarea, "New content");

      // Submit
      const submitButton = screen.getByRole("button", { name: /update post/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(adminPostsApi.update).toHaveBeenCalledWith(
          mockPostData.slug,
          expect.objectContaining({
            title: mockPostData.title,
            excerpt: mockPostData.excerpt,
            content: "New content",
          }),
        );
      });
    });

    it("should disable submit button while submitting in edit mode", async () => {
      const user = userEvent.setup();
      let resolveUpdate: (value: any) => void;
      const updatePromise = new Promise((resolve) => {
        resolveUpdate = resolve;
      });
      (adminPostsApi.update as ReturnType<typeof vi.fn>).mockReturnValue(
        updatePromise,
      );

      render(<PostForm mode="edit" initialData={mockPostData} />);

      const submitButton = screen.getByRole("button", { name: /update post/i });
      await user.click(submitButton);

      // Button should be disabled and show "Saving..."
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent("Saving...");

      // Resolve the promise
      resolveUpdate!(mockPostData);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        expect(submitButton).toHaveTextContent("Update Post");
      });
    });
  });

  describe("Create Mode", () => {
    it("should correctly initialize with empty data", () => {
      render(<PostForm mode="create" />);

      // Check if the form elements are initialized with empty values
      const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
      const excerptInput = screen.getByLabelText(
        /excerpt/i,
      ) as HTMLInputElement;
      const contentTextarea = screen.getByLabelText(
        /content/i,
      ) as HTMLTextAreaElement;

      expect(titleInput.value).toBe("");
      expect(excerptInput.value).toBe("");
      expect(contentTextarea.value).toBe("");
    });

    it('should display "Create New Post" title in create mode', () => {
      render(<PostForm mode="create" />);

      expect(screen.getByText("Create New Post")).toBeInTheDocument();
    });

    it('should display "Create Post" button text in create mode', () => {
      render(<PostForm mode="create" />);

      expect(
        screen.getByRole("button", { name: /create post/i }),
      ).toBeInTheDocument();
    });

    it("should call adminPostsApi.create with form data on submit", async () => {
      const user = userEvent.setup();
      const newPost = {
        ...mockPostData,
        id: "new-post-id",
        slug: "new-post-slug",
      };
      (adminPostsApi.create as ReturnType<typeof vi.fn>).mockResolvedValue(
        newPost,
      );

      render(<PostForm mode="create" />);

      // Fill in the form
      const titleInput = screen.getByLabelText(/title/i);
      const excerptInput = screen.getByLabelText(/excerpt/i);
      const contentTextarea = screen.getByLabelText(/content/i);

      await user.type(titleInput, "New Post Title");
      await user.type(excerptInput, "New post excerpt");
      await user.type(contentTextarea, "New post content");

      // Submit the form
      const submitButton = screen.getByRole("button", { name: /create post/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(adminPostsApi.create).toHaveBeenCalledWith({
          title: "New Post Title",
          excerpt: "New post excerpt",
          content: "New post content",
        });
      });
    });

    it("should disable submit button while submitting in create mode", async () => {
      const user = userEvent.setup();
      let resolveCreate: (value: any) => void;
      const createPromise = new Promise((resolve) => {
        resolveCreate = resolve;
      });
      (adminPostsApi.create as ReturnType<typeof vi.fn>).mockReturnValue(
        createPromise,
      );

      render(<PostForm mode="create" />);

      // Fill in required fields
      const titleInput = screen.getByLabelText(/title/i);
      const excerptInput = screen.getByLabelText(/excerpt/i);
      const contentTextarea = screen.getByLabelText(/content/i);

      await user.type(titleInput, "Test");
      await user.type(excerptInput, "Test");
      await user.type(contentTextarea, "Test");

      const submitButton = screen.getByRole("button", { name: /create post/i });
      await user.click(submitButton);

      // Button should be disabled and show "Saving..."
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent("Saving...");

      // Resolve the promise
      resolveCreate!(mockPostData);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        expect(submitButton).toHaveTextContent("Create Post");
      });
    });

    it("should not call update in create mode", async () => {
      const user = userEvent.setup();
      (adminPostsApi.create as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockPostData,
      );

      render(<PostForm mode="create" />);

      const titleInput = screen.getByLabelText(/title/i);
      const excerptInput = screen.getByLabelText(/excerpt/i);
      const contentTextarea = screen.getByLabelText(/content/i);

      await user.type(titleInput, "Test");
      await user.type(excerptInput, "Test");
      await user.type(contentTextarea, "Test");

      const submitButton = screen.getByRole("button", { name: /create post/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(adminPostsApi.create).toHaveBeenCalled();
        expect(adminPostsApi.update).not.toHaveBeenCalled();
      });
    });
  });

  describe("Common Functionality", () => {
    it("should have all required form fields", () => {
      render(<PostForm mode="create" />);

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/excerpt/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/image/i)).toBeInTheDocument();
    });

    it("should handle form field changes", async () => {
      const user = userEvent.setup();
      render(<PostForm mode="create" />);

      const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;

      await user.type(titleInput, "Test Title");

      expect(titleInput.value).toBe("Test Title");
    });

    it("should prevent form submission without required fields", async () => {
      render(<PostForm mode="create" />);

      const submitButton = screen.getByRole("button", { name: /create post/i });
      const form = submitButton.closest("form");

      expect(form).toBeInTheDocument();

      // All required fields should have the required attribute
      const titleInput = screen.getByLabelText(/title/i);
      const excerptInput = screen.getByLabelText(/excerpt/i);
      const contentTextarea = screen.getByLabelText(/content/i);

      expect(titleInput).toBeRequired();
      expect(excerptInput).toBeRequired();
      expect(contentTextarea).toBeRequired();
    });
  });

  describe("Image Upload", () => {
    it("should handle image file selection", async () => {
      const user = userEvent.setup();
      render(<PostForm mode="create" />);

      const fileInput = screen.getByLabelText(/image/i);
      const file = new File(["image content"], "test.png", {
        type: "image/png",
      });

      await user.upload(fileInput, file);

      expect(fileInput).toBeInTheDocument();
    });

    it("should call uploadImage when image is selected in create mode", async () => {
      const user = userEvent.setup();
      (adminPostsApi.create as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockPostData,
      );
      (adminPostsApi.uploadImage as ReturnType<typeof vi.fn>).mockResolvedValue(
        {
          id: "image-123",
          url: "http://example.com/image.png",
        },
      );

      render(<PostForm mode="create" />);

      // Fill in required fields
      await user.type(screen.getByLabelText(/title/i), "Test");
      await user.type(screen.getByLabelText(/excerpt/i), "Test");
      await user.type(screen.getByLabelText(/content/i), "Test");

      // Upload image
      const fileInput = screen.getByLabelText(/image/i);
      const file = new File(["image content"], "test.png", {
        type: "image/png",
      });
      await user.upload(fileInput, file);

      // Submit form
      const submitButton = screen.getByRole("button", { name: /create post/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(adminPostsApi.uploadImage).toHaveBeenCalledWith(file);
      });
    });
  });
});
