import { ref } from 'vue';

type User = {
    id: string;
    email: string;
    avatarUrl: string;
};

type Post = {
    id: string;
    author: User;
    imageUrl: string;
    caption: string;
    likes: number;
    timestamp: string;
    shared?: {
        isSharedPost: boolean;
        id: string;
        author: User;
        sharedAt?: string; // Timestamp when the post was shared
        shareCount?: number; // How many times the post has been shared
    };
    isPinned: boolean;
    type: 'text' | 'image' | 'video' | 'link';
    tags?: string[]; // Tags in the post
    isEdited: boolean;
    sharesCount: number;
    mentions?: User[]; // Users mentioned in the post
};

export const sharedPost = ref<Post[]>(
    [
        {
            id: "5",
            author: {
                id: "u1",
                email: "johndoe123",
                avatarUrl: "https://example.com/avatars/johndoe.jpg",
            },
            imageUrl: "https://example.com/posts/post1.jpg",
            caption: "Had a great time at the beach today! #beachlife #sunnydays",
            likes: 142,
            timestamp: "2025-10-07T14:45:00Z",
            isPinned: false,
            type: "image",
            tags: ["beachlife", "vacation", "sunnydays"],
            isEdited: false,
            sharesCount: 5,
        }
    ]
);