import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import EditPost from "@/pages/Admin/EditPost";
import type { PostWithRelations } from "@/types/EntityTypes";

// Mock the adminPostsApi
vi.mock("@/api/adminApi/adminPostApi", () => ({
  default: {
    getBySlug: vi.fn(),
  },
}));

// Mock the PostForm component
vi.mock("@/components/layout/adminPanel/PostForm", () => ({
  default: ({ mode, initialData }: { mode: string; initialData: any }) => (
    <div data-testid="post-form">
      <div data-testid="form-mode">{mode}</div>
      <div data-testid="form-initial-data">{JSON.stringify(initialData)}</div>
    </div>
  ),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

import adminPostsApi from "@/api/adminApi/adminPostApi";
import { toast } from "sonner";

describe("EditPost Component", () => {
  const mockPost: PostWithRelations = {
    id: "post-123",
    title: "Test Post",
    content: "Test content",
    excerpt: "Test excerpt",
    slug: "test-post-slug",
    authorId: "author-123",
    imageId: null,
    categoryId: null,
    isPublished: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-02"),
    author: null,
    comments: [],
    categories: null,
    tags: [],
    likes: [],
    _count: {
      comments: 5,
      tags: 2,
      likes: 10,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (slug: string) => {
    return render(
      <BrowserRouter>
        <Routes>
          <Route path="/admin/posts/edit/:slug" element={<EditPost />} />
        </Routes>
      </BrowserRouter>,
      {
        wrapper: ({ children }) => {
          // Navigate to the route with the slug
          window.history.pushState({}, "", `/admin/posts/edit/${slug}`);
          return <>{children}</>;
        },
      },
    );
  };

  it("should correctly fetch and display post data based on the URL slug", async () => {
    (adminPostsApi.getBySlug as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockPost,
    );

    renderWithRouter("test-post-slug");

    // Should show loading initially
    expect(screen.getByText("Loading post details...")).toBeInTheDocument();

    // Wait for the post to be loaded
    await waitFor(() => {
      expect(adminPostsApi.getBySlug).toHaveBeenCalledWith("test-post-slug");
    });

    // Should render PostForm with the correct data
    await waitFor(() => {
      expect(screen.getByTestId("post-form")).toBeInTheDocument();
      expect(screen.getByTestId("form-mode")).toHaveTextContent("edit");
    });

    // Verify the initial data is passed correctly
    const formData = screen.getByTestId("form-initial-data");
    const parsedData = JSON.parse(formData.textContent || "{}");
    expect(parsedData.title).toBe("Test Post");
    expect(parsedData.slug).toBe("test-post-slug");
  });

  it("should display loading state while fetching post", async () => {
    (adminPostsApi.getBySlug as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockPost), 100)),
    );

    renderWithRouter("test-post-slug");

    expect(screen.getByText("Loading post details...")).toBeInTheDocument();
  });

  it("should display error message when post fetch fails", async () => {
    const mockError = new Error("Failed to fetch");
    (adminPostsApi.getBySlug as ReturnType<typeof vi.fn>).mockRejectedValue(
      mockError,
    );

    renderWithRouter("test-post-slug");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error", {
        description: "Failed to load post details.",
      });
    });

    await waitFor(() => {
      expect(screen.getByText("Post not found.")).toBeInTheDocument();
    });
  });

  it('should display "Post not found" when post is null', async () => {
    (adminPostsApi.getBySlug as ReturnType<typeof vi.fn>).mockResolvedValue(
      null,
    );

    renderWithRouter("non-existent-slug");

    await waitFor(() => {
      expect(screen.getByText("Post not found.")).toBeInTheDocument();
    });
  });

  it("should not fetch post if slug is undefined", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/posts/edit"]}>
        <Routes>
          <Route path="/admin/posts/edit" element={<EditPost />} />
        </Routes>
      </MemoryRouter>,
    );

    // Should show loading but not call API
    await waitFor(() => {
      expect(screen.getByText("Post not found.")).toBeInTheDocument();
    });

    expect(adminPostsApi.getBySlug).not.toHaveBeenCalled();
  });

  it("should call getBySlug with the correct slug from URL params", async () => {
    (adminPostsApi.getBySlug as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockPost,
    );

    const testSlug = "my-unique-post-slug-123";
    renderWithRouter(testSlug);

    await waitFor(() => {
      expect(adminPostsApi.getBySlug).toHaveBeenCalledWith(testSlug);
      expect(adminPostsApi.getBySlug).toHaveBeenCalledTimes(1);
    });
  });

  it("should re-fetch post when slug changes", async () => {
    (adminPostsApi.getBySlug as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockPost,
    );

    const { rerender } = renderWithRouter("first-slug");

    await waitFor(() => {
      expect(adminPostsApi.getBySlug).toHaveBeenCalledWith("first-slug");
    });

    // Update the URL to a different slug
    rerender(
      <MemoryRouter initialEntries={["/admin/posts/edit/second-slug"]}>
        <Routes>
          <Route path="/admin/posts/edit/:slug" element={<EditPost />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(adminPostsApi.getBySlug).toHaveBeenCalledWith("second-slug");
    });
  });
});
