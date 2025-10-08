export interface Post {
  _id: string;
  title: string;
  type: string;
  tags: string[];
  link: string;
  createdAt?: string;
}

export interface CreatePostData {
  title: string;
  type: string;
  tags: string[];
  link: string;
}
