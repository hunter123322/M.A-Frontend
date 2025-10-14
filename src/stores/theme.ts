// src/store/theme.ts
import { ref, computed } from 'vue';

const isDarkMode = ref(true);

export function useTheme() {
  const toggleDarkMode = () => {
    console.log("isDarkMode");
    isDarkMode.value = !isDarkMode.value;
  };

  const isDark = isDarkMode;

  return {
    isDark,
    toggleDarkMode,
  };
}