import { describe, it, expect, vi, beforeEach } from 'vitest';
import adminPostsApi from '@/api/adminApi/adminPostApi';
import type { PostWithRelations } from '@/types/EntityTypes';

// Mock the apiRequest function
vi.mock('@/api/apiClient', () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from '@/api/apiClient';

describe('adminPostsApi.update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send a PUT request with the correct slug and data', async () => {
    const testSlug = 'test-post-slug';
    const testData: Partial<PostWithRelations> = {
      title: 'Updated Title',
      content: 'Updated content',
      excerpt: 'Updated excerpt',
    };

    const mockResponse: PostWithRelations = {
      id: 'post-123',
      title: 'Updated Title',
      content: 'Updated content',
      excerpt: 'Updated excerpt',
      slug: testSlug,
      authorId: 'author-123',
      imageId: null,
      categoryId: null,
      isPublished: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      author: null,
      comments: [],
      categories: null,
      tags: [],
      likes: [],
      _count: {
        comments: 0,
        tags: 0,
        likes: 0,
      },
    };

    (apiRequest as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const result = await adminPostsApi.update(testSlug, testData);

    // Verify apiRequest was called with correct parameters
    expect(apiRequest).toHaveBeenCalledWith(`/admin/posts/${testSlug}`, {
      method: 'PUT',
      body: JSON.stringify(testData),
    });

    // Verify the result
    expect(result).toEqual(mockResponse);
  });

  it('should handle partial updates correctly', async () => {
    const testSlug = 'another-post-slug';
    const partialData: Partial<PostWithRelations> = {
      title: 'Only Title Changed',
    };

    const mockResponse: PostWithRelations = {
      id: 'post-456',
      title: 'Only Title Changed',
      content: 'Original content',
      excerpt: 'Original excerpt',
      slug: testSlug,
      authorId: 'author-456',
      imageId: null,
      categoryId: null,
      isPublished: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      author: null,
      comments: [],
      categories: null,
      tags: [],
      likes: [],
      _count: {
        comments: 0,
        tags: 0,
        likes: 0,
      },
    };

    (apiRequest as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const result = await adminPostsApi.update(testSlug, partialData);

    expect(apiRequest).toHaveBeenCalledWith(`/admin/posts/${testSlug}`, {
      method: 'PUT',
      body: JSON.stringify(partialData),
    });

    expect(result).toEqual(mockResponse);
  });

  it('should properly serialize data to JSON', async () => {
    const testSlug = 'json-test-slug';
    const testData = {
      title: 'Test Title',
      content: 'Test content with special chars: <>&"',
      excerpt: null,
    };

    (apiRequest as ReturnType<typeof vi.fn>).mockResolvedValue({} as PostWithRelations);

    await adminPostsApi.update(testSlug, testData);

    expect(apiRequest).toHaveBeenCalledWith(`/admin/posts/${testSlug}`, {
      method: 'PUT',
      body: JSON.stringify(testData),
    });

    // Verify that JSON.stringify is properly handling the data
    const callArgs = (apiRequest as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(callArgs[1].body).toBe(JSON.stringify(testData));
  });

  it('should handle slug with special characters', async () => {
    const specialSlug = 'post-with-numbers-123-and-dashes';
    const testData = {
      title: 'Test',
    };

    (apiRequest as ReturnType<typeof vi.fn>).mockResolvedValue({} as PostWithRelations);

    await adminPostsApi.update(specialSlug, testData);

    expect(apiRequest).toHaveBeenCalledWith(`/admin/posts/${specialSlug}`, {
      method: 'PUT',
      body: JSON.stringify(testData),
    });
  });

  it('should propagate errors from apiRequest', async () => {
    const testSlug = 'error-slug';
    const testData = { title: 'Test' };
    const mockError = new Error('Network error');

    (apiRequest as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

    await expect(adminPostsApi.update(testSlug, testData)).rejects.toThrow('Network error');
  });
});
