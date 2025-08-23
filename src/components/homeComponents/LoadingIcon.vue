<template>
    <section>
        <span class="inline-flex items-center gap-2" role="status" :aria-label="label" aria-live="polite">
            <svg :class="['animate-spin', sizeClass]" viewBox="0 0 24 24" fill="none">
                <!-- track -->
                <circle cx="12" cy="12" r="10" class="opacity-25" :class="trackClass" stroke-width="4"
                    stroke="currentColor" />
                <!-- arc -->
                <path class="opacity-75" :class="arcClass" fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
            </svg>
            <slot>{{ label }}</slot>
        </span>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    size?: 'xs' | 'sm' | 'md' | 'lg';
    color?: 'gray' | 'blue' | 'indigo' | 'emerald' | 'rose' | 'white' | 'black';
    label?: string;
}
const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    color: 'blue',
    label: 'Loading…'
});

const sizeClass = computed(() => ({
    xs: 'h-4 w-4',
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
}[props.size]));

const colorMap = {
    gray: { arc: 'text-gray-500', track: 'text-gray-300' },
    blue: { arc: 'text-blue-600', track: 'text-blue-200' },
    indigo: { arc: 'text-indigo-600', track: 'text-indigo-200' },
    emerald: { arc: 'text-emerald-600', track: 'text-emerald-200' },
    rose: { arc: 'text-rose-600', track: 'text-rose-200' },
    white: { arc: 'text-white', track: 'text-white/30' },
    black: { arc: 'text-black', track: 'text-black/30' },
} as const;

const arcClass = computed(() => colorMap[props.color].arc);
const trackClass = computed(() => colorMap[props.color].track);
</script>
