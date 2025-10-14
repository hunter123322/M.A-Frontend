import { ref } from 'vue';

export type User = {
    id: string;
    email: string;
    avatarUrl: string;
};

export type Post = {
    id: string;
    author: User;
    imageUrl: string;
    caption: string;
    likes: number;
    timestamp?: string;
    shared?: {
        isSharedPost: boolean;
        id: string;
        author: User;
        sharedAt?: string; // Timestamp when the post was shared
        shareCount?: number; // How many times the post has been shared
    };
    isPinned: boolean;
    type: 'text' | 'image';
    tags?: string[]; // Tags in the post
    isEdited: boolean;
    sharesCount: number;
    mentions?: User[]; // Users mentioned in the post
    commentCount?: number;
};

export const posts = ref<Post[]>(
    [
        {
            id: "1",
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
            commentCount: 1,
        },
        {
            id: "2",
            author: {
                id: "u2",
                email: "sarah_lee",
                avatarUrl: "https://example.com/avatars/sarahlee.jpg",
            },
            imageUrl: "",
            caption: "Loving this new book! Highly recommend it to anyone who loves thrillers. 📚 #bookrecommendations #thriller",
            likes: 87,
            timestamp: "2025-10-06T09:30:00Z",
            isPinned: false,
            type: "text",
            tags: ["bookrecommendations", "thriller"],
            isEdited: false,
            sharesCount: 2,
        },
        {
            id: "3",
            author: {
                id: "u3",
                email: "techguy2025",
                avatarUrl: "https://example.com/avatars/techguy.jpg",
            },
            imageUrl: "https://example.com/posts/post3.jpg",
            caption: "Check out my new gadget review! 🚀 Let me know your thoughts. #techreviews #gadgets #innovation",
            likes: 215,
            timestamp: "2025-10-05T18:00:00Z",
            isPinned: true,
            type: "image",
            tags: ["techreviews", "gadgets", "innovation"],
            isEdited: true,
            sharesCount: 12,
        },
        {
            id: "4",
            author: {
                id: "u4",
                email: "fitnessfanatic",
                avatarUrl: "https://example.com/avatars/fitnessfanatic.jpg",
            },
            imageUrl: "",
            caption: "Morning workout grind! 💪 Starting the day strong. #fitlife #morningworkout",
            likes: 320,
            timestamp: "2025-10-07T06:45:00Z",
            isPinned: false,
            type: "text",
            tags: ["fitlife", "morningworkout"],
            isEdited: false,
            sharesCount: 15,
        },
    ]);