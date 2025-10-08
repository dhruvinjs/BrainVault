import type { Post, CreatePostData } from '../types';

const API_BASE_URL = 'https://brainvault-j3hx.onrender.com';

export const api = {
  getPosts: async (): Promise<Post[]> => {
    const response = await fetch(`${API_BASE_URL}/api/posts`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return response.json();
  },

  createPost: async (data: CreatePostData): Promise<Post> => {
    const response = await fetch(`${API_BASE_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create post');
    }
    return response.json();
  },

  deletePost: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
  },
};
