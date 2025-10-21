export type User = {
  id: number;
  username: string;
  avatarUrl: number | string;
};

export type Post = {
  _id: string;
  author: User;
  imageUrl: string;
  caption: string;
  likes: number;
  timestamp?: string;
  shared?: {
    isSharedPost: boolean,
    post: Post
  };
  isPinned: boolean;
  type: 'text' | 'image';
  tags?: string[]; // Tags in the post
  isEdited: boolean;
  sharesCount: number;
  mentions?: User[]; // Users mentioned in the post
  commentCount: number;
  createdAt: Date
  isLiked?: boolean
};

export type CommentType = {
  _id: string;
  postID?: string;
  commentID?: string;
  text: string;
  likes: number;
  author: User;
  showReply?: boolean;
  mentions?: User[];
  createdAt: Date;
  updatedAt?: string;
};

export type JWTPayload = {
  user_id: number;
  email?: string;
  username: string;
  author: User
}

export type NotificationType = {
    _id: string;
    userID: number;
    actor: User;
    engagementID: string
    categories: "post" | "mention" | "like" | "follow" | "comment" | "system";
    content: string;
    read: boolean;
    createdAt?: string;
    updatedAt?: string;
}