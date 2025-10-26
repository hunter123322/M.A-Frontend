import { ref } from "vue";

type Page = 'Home' | 'Notifications' | 'Profile' | 'Messages' | 'Settings' | 'Searchs';

export const currentPage = ref<Page>('Home');
