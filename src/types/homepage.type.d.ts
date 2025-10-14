// src/types/index.ts

/**
 * Represents a user profile in the application.
 */
export type User = {
  id: string;
  username: string;
  avatarUrl: string;
  bio: string;
  interests: string[];
};

/**
 * Represents a post in the user feed.
 */
export type Post = {
  id: string;
  author: Pick<User, 'id' | 'username' | 'avatarUrl'>;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
};

/**
 * Represents a notification for a user.
 */
export type Notification = {
  id: string;
  user: Pick<User, 'id' | 'username' | 'avatarUrl'>;
  action: 'liked your post' | 'commented on your post' | 'started following you';
  timestamp: string;
};
