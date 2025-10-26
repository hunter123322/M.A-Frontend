<script setup lang="ts">
import { ref } from 'vue';
import {
    ChevronRight,
    User,
    Bell,
    Palette,
    Lock,
    LogOut,
    Settings,
    Key,
    Shield,
    Moon,
    Globe,
    HelpCircle,
    Database,
    Info,
    Smartphone,
    Wifi,
    Trash2,
    FileText
} from 'lucide-vue-next';

const pushNotifications = ref(true);
const darkMode = ref(true);

const settingsSections = [
    {
        title: 'Account & Profile',
        icon: User,
        color: 'text-pink-400',
        items: [
            { label: 'Edit Profile Information', description: 'Update your nickname, bio, and avatar.', action: 'edit-profile', type: 'link', status: "" },
            { label: 'Change Password', description: 'Update your security credentials.', action: 'change-password', type: 'link', status: "" },
            { label: 'Connected Accounts', description: 'Manage linked Google or Apple accounts.', action: 'connected-accounts', type: 'link', status: "" },
        ]
    },
    {
        title: 'Appearance',
        icon: Palette,
        color: 'text-purple-400',
        items: [
            { label: 'Dark Theme', description: 'Switch between light and dark modes.', action: 'toggle-dark', type: 'toggle', state: darkMode, status: "" },
            { label: 'Font Size', description: 'Adjust text size across the app.', action: 'font-size', type: 'link', status: "" },
            { label: 'App Accent Color', description: 'Choose your preferred highlight color.', action: 'accent-color', type: 'link', status: "" },
        ]
    },
    {
        title: 'Notifications',
        icon: Bell,
        color: 'text-blue-400',
        items: [
            { label: 'Push Notifications', description: 'Receive alerts when the app is closed.', action: 'toggle-push', type: 'toggle', state: pushNotifications, status: "" },
            { label: 'Email Alerts', description: 'Receive important updates via email.', action: 'toggle-email', type: 'toggle', state: ref(false), status: "" },
            { label: 'Sound & Vibration', description: 'Configure how you’re alerted.', action: 'sound-settings', type: 'link', status: "" },
        ]
    },
    {
        title: 'Privacy & Security',
        icon: Lock,
        color: 'text-teal-400',
        items: [
            { label: 'Manage Blocked Users', description: 'View and unblock users.', action: 'blocked-users', type: 'link', status: "" },
            { label: 'Two-Factor Authentication (2FA)', description: 'Add an extra layer of security.', action: '2fa', type: 'link', status: 'Disabled' },
            { label: 'Active Sessions', description: 'See where you’re logged in.', action: 'sessions', type: 'link', status: "" },
            { label: 'App Permissions', description: 'Review access permissions.', action: 'permissions', type: 'link', status: "" },
        ]
    },
    {
        title: 'Language & Region',
        icon: Globe,
        color: 'text-green-400',
        items: [
            { label: 'Language', description: 'Change your preferred language.', action: 'language', type: 'link', status: 'English (US)' },
            { label: 'Region Settings', description: 'Adjust time zone and date format.', action: 'region', type: 'link', status: 'GMT+8' },
        ]
    },
    {
        title: 'Storage & Data',
        icon: Database,
        color: 'text-yellow-400',
        items: [
            { label: 'Manage Cache', description: 'Free up storage space by clearing cache.', action: 'cache', type: 'link', status: "" },
            { label: 'Data Saver', description: 'Reduce mobile data usage.', action: 'data-saver', type: 'toggle', state: ref(false), status: "" },
            { label: 'Download Settings', description: 'Control how files are downloaded.', action: 'downloads', type: 'link', status: "" },
        ]
    },
    {
        title: 'Support & Feedback',
        icon: HelpCircle,
        color: 'text-cyan-400',
        items: [
            { label: 'Help Center', description: 'Read guides and FAQs.', action: 'help', type: 'link', status: "" },
            { label: 'Send Feedback', description: 'Share your thoughts with us.', action: 'feedback', type: 'link', status: "" },
            { label: 'Report a Bug', description: 'Found an issue? Let us know.', action: 'bug-report', type: 'link', status: "" },
        ]
    },
    {
        title: 'System Information',
        icon: Info,
        color: 'text-gray-400',
        items: [
            { label: 'App Version', description: 'Current build of the app.', action: 'app-version', type: 'link', status: 'v1.0.3' },
            { label: 'Device Info', description: 'View your device and OS details.', action: 'device-info', type: 'link', status: "" },
            { label: 'Network Status', description: 'Monitor your connection type.', action: 'network-status', type: 'link', status: 'Online' },
        ]
    },
    {
        title: 'Advanced Options',
        icon: Shield,
        color: 'text-red-400',
        items: [
            { label: 'Developer Mode', description: 'Access developer tools and logs.', action: 'dev-mode', type: 'toggle', state: ref(false), status: "" },
            { label: 'Reset App Settings', description: 'Restore defaults for all preferences.', action: 'reset-settings', type: 'link', status: "" },
            { label: 'Clear All Data', description: 'Remove all stored app data.', action: 'clear-data', type: 'link', status: "" },
        ]
    },
];
</script>


<template>
    <div class="min-h-screen bg-gray-900 text-white p-4 pb-20 font-sans">

        <!-- Header -->
        <header class="md:mt-0 sticky top-0 z-10 py-4 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
            <h1 class="text-3xl font-extrabold text-white flex items-center">
                <Settings class="w-7 h-7 mr-3 text-pink-500" /> App Settings
            </h1>
        </header>

        <!-- Settings Content -->
        <section class="mt-8 space-y-10">

            <div v-for="section in settingsSections" :key="section.title">
                <!-- Section Header -->
                <h2 class="text-xl font-bold mb-4 flex items-center space-x-2 border-b border-gray-800 pb-2">
                    <component :is="section.icon" class="w-5 h-5" :class="section.color" />
                    <span class="text-gray-200">{{ section.title }}</span>
                </h2>

                <!-- List of Settings Items -->
                <div
                    class="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 divide-y divide-gray-700">
                    <div v-for="item in section.items" :key="item.label"
                        @click="item.type === 'link' ? console.log('Navigating to:', item.action) : null"
                        :class="['flex items-center justify-between p-4 transition-colors', item.type === 'link' ? 'hover:bg-gray-700/50 cursor-pointer' : '']">
                        <!-- Text and Description -->
                        <div class="flex-1 min-w-0 pr-4">
                            <p class="font-medium text-white text-base truncate">{{ item.label }}</p>
                            <p class="text-xs text-gray-400 mt-0.5 truncate">{{ item.description }}</p>
                        </div>

                        <!-- Action/Control Area -->
                        <div class="flex items-center space-x-2">
                            <template v-if="item.type === 'link'">
                                <span v-if="item.status" class="text-xs text-gray-500">{{ item.status }}</span>
                                <ChevronRight class="w-5 h-5 text-gray-500" />
                            </template>

                            <template v-else-if="item.type === 'toggle'">
                                <!-- Custom Toggle Switch -->
                                <button @click.stop="item.state && (item.state.value = !item.state.value)" :class="[
                                    'relative w-12 h-6 rounded-full transition-all duration-300',
                                    item.state && item.state.value ? 'bg-pink-600' : 'bg-gray-600'
                                ]">
                                    <span :class="[
                                        'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300',
                                        item.state && item.state.value ? 'translate-x-6' : 'translate-x-0'
                                    ]"></span>
                                </button>
                            </template>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Log Out Button - Separate Action -->
            <div class="mt-12 pt-6 border-t border-gray-700">
                <button @click="console.log('Logging out...')"
                    class="w-full flex items-center justify-center space-x-3 p-4 bg-red-800/50 text-red-300 rounded-xl border border-red-700 hover:bg-red-700/70 transition-colors shadow-lg shadow-red-900/30">
                    <LogOut class="w-5 h-5" />
                    <span class="font-bold text-lg">Log Out</span>
                </button>
            </div>

        </section>
    </div>
</template>
