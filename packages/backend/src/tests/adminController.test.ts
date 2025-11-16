import type { Request, Response } from "express";
import { updatePostAdmin } from "../controllers/adminController.js";
import prisma from "../db/prismaClient.js";
import type { Post as PostType } from "@prisma/client";

// Mock Prisma client
jest.mock("../db/prismaClient.js", () => ({
  __esModule: true,
  default: {
    post: {
      update: jest.fn(),
    },
  },
}));

describe("updatePostAdmin", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup mock response
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it("should correctly update a post using its slug", async () => {
    const mockSlug = "test-post-slug";
    const mockUpdates = {
      title: "Updated Title",
      content: "Updated content",
      excerpt: "Updated excerpt",
    };
    const mockUpdatedPost: PostType = {
      id: "post-id-123",
      title: "Updated Title",
      content: "Updated content",
      excerpt: "Updated excerpt",
      slug: mockSlug,
      authorId: "author-id-123",
      imageId: null,
      categoryId: null,
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Setup mock request
    mockRequest = {
      params: { slug: mockSlug },
      body: mockUpdates,
    };

    // Mock prisma update to return the updated post
    (prisma.post.update as jest.Mock).mockResolvedValue(mockUpdatedPost);

    // Call the controller
    await updatePostAdmin(
      mockRequest as Request,
      mockResponse as Response,
    );

    // Assertions
    expect(prisma.post.update).toHaveBeenCalledWith({
      where: { slug: mockSlug },
      data: mockUpdates,
    });

    expect(jsonMock).toHaveBeenCalledWith({
      status: "success",
      message: "Post updated successfully,",
      data: { post: mockUpdatedPost },
    });
  });

  it("should return 400 error if slug is missing", async () => {
    mockRequest = {
      params: {},
      body: { title: "Updated Title" },
    };

    await updatePostAdmin(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "error",
      message: "Bad request: post missing parameter: post slug.",
      data: undefined,
    });
    expect(prisma.post.update).not.toHaveBeenCalled();
  });

  it("should return 400 error if updates are missing", async () => {
    mockRequest = {
      params: { slug: "test-slug" },
      body: undefined,
    };

    await updatePostAdmin(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "error",
      message: "Bad request: post missing parameter: post slug.",
      data: undefined,
    });
    expect(prisma.post.update).not.toHaveBeenCalled();
  });

  it("should return 500 error if prisma update fails", async () => {
    mockRequest = {
      params: { slug: "test-slug" },
      body: { title: "Updated Title" },
    };

    const mockError = new Error("Database error");
    (prisma.post.update as jest.Mock).mockRejectedValue(mockError);

    await updatePostAdmin(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "error",
      message: "Internal Server Error.",
      data: undefined,
    });
  });

  it("should handle partial updates", async () => {
    const mockSlug = "test-post-slug";
    const mockPartialUpdate = {
      title: "Only Title Updated",
    };
    const mockUpdatedPost: PostType = {
      id: "post-id-123",
      title: "Only Title Updated",
      content: "Original content",
      excerpt: "Original excerpt",
      slug: mockSlug,
      authorId: "author-id-123",
      imageId: null,
      categoryId: null,
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRequest = {
      params: { slug: mockSlug },
      body: mockPartialUpdate,
    };

    (prisma.post.update as jest.Mock).mockResolvedValue(mockUpdatedPost);

    await updatePostAdmin(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(prisma.post.update).toHaveBeenCalledWith({
      where: { slug: mockSlug },
      data: mockPartialUpdate,
    });

    expect(jsonMock).toHaveBeenCalledWith({
      status: "success",
      message: "Post updated successfully,",
      data: { post: mockUpdatedPost },
    });
  });
});
