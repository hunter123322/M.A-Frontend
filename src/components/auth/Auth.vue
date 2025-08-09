<script setup lang="ts">
import { ref } from 'vue'

type ValidationResult = { isValid: boolean; message?: string }

const activeTab = ref<'login' | 'signup' | 'information' | 'location'>('login');
const information = ref<boolean>(false);
const location = ref<boolean>(false)

// Login form state
const loginForm = ref({ email: '', password: '' });
const loginError = ref<string | null>(null);

// Signup form state
const signupForm = ref({ email: '', password: '', confirmPassword: '' });
const signupError = ref<string | null>(null);

// Validation
function validateForm(email: string, password: string, confirmPassword?: string): ValidationResult {
    if (!email || !password || (confirmPassword !== undefined && !confirmPassword)) {
        return { isValid: false, message: 'All fields are required!' }
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$/
    if (!emailRegex.test(email)) {
        return { isValid: false, message: 'Please enter a valid email address.' }
    }
    if (password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters long.' }
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
        return { isValid: false, message: 'Passwords do not match!' }
    }
    return { isValid: true }
}

// Submit helper
async function submitForm(url: string, data: Record<string, any>) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return { status: response.status, data: await response.json() }
}

// Handle Signup
async function handleSignup() {
    signupError.value = null
    const { email, password, confirmPassword } = signupForm.value
    const validation = validateForm(email, password, confirmPassword)
    if (!validation.isValid) {
        signupError.value = validation.message || 'Invalid form data'
        return
    }

    try {
        const { status, data } = await submitForm('http://localhost:3000/signup', { username: email, password })
        if (status === 200) {
            localStorage.setItem('user_id', data.user_id);
            activeTab.value = 'information'
            information.value = true
        } else {
            signupError.value = data.error || 'Signup failed'
        }
    } catch (err) {
        signupError.value = 'Signup failed: Network error'
    }
}

// Handle Login
async function handleLogin() {
    loginError.value = null
    const { email, password } = loginForm.value
    const validation = validateForm(email, password)
    if (!validation.isValid) {
        loginError.value = validation.message || 'Invalid form data'
        return
    }

    try {
        const { status, data } = await submitForm('http://localhost:3000/login', { username: email, password })
        if (status === 200 && data.user_id) {
            localStorage.setItem('user_id', data.user_id)
            localStorage.setItem('messageData', JSON.stringify(data.messages))
            localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
            const contact = [...new Set(data.messages.map((msg: any) => msg.conversationID))]
            localStorage.setItem('contact', JSON.stringify(contact))
            window.location.href = `/chat?user=${data.user_id}`
        } else {
            loginError.value = data.error || 'Login failed'
        }
    } catch (err) {
        loginError.value = 'Login failed: Network error'
    }
}

// User Information 
interface UserInfo {
    firstName: string
    middleName?: string
    lastName: string
    age: number | null
}

const form = ref<UserInfo>({
    firstName: '',
    middleName: '',
    lastName: '',
    age: null
})

const loading = ref(false)
const response = ref<{ message: string; type: 'success' | 'error' | '' }>({
    message: '',
    type: ''
})

function showInformationResponse(message: string, type: 'success' | 'error') {
    response.value = { message, type }
}

function userCredentialValidateForm(): boolean {
    if (!form.value.firstName || !form.value.lastName || !form.value.age) {
        showInformationResponse('Please fill in all required fields.', 'error')
        return false
    }
    if (isNaN(Number(form.value.age)) || Number(form.value.age) <= 0) {
        showInformationResponse('Please enter a valid age.', 'error')
        return false
    }
    return true
}

async function sendUserInformationRequest(userInfo: UserInfo) {
    try {
        const res = await fetch('http://localhost:3000/signup/information', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userInfo)
        })
        const result = await res.json()
        if (!result) {
            showInformationResponse('Submission failed. Please try again.', 'error')
        } else {
            window.location.href = '/signup/location'
            activeTab.value = 'location'
            information.value = false
            location.value = true
        }
    } catch (err) {
        console.error(err)
        showInformationResponse('An error occurred. Please try again.', 'error')
    }
}

async function handleSubmit() {
    if (!userCredentialValidateForm()) return
    loading.value = true
    try {
        await sendUserInformationRequest(form.value)
        localStorage.setItem('userInfo', JSON.stringify(form.value))
        showInformationResponse(
            `Thank you, ${form.value.firstName} ${form.value.middleName ? form.value.middleName + ' ' : ''}${form.value.lastName}!`,
            'success'
        )
    } finally {
        loading.value = false
    }
}

// User Location 
interface AddressForm {
    country: string
    region: string
    district: string
    municipality: string
    barangay: string
    zone: string
    house_number: string
}

const fields = [
    { id: 'country', label: 'Country', type: 'text' },
    { id: 'region', label: 'Region', type: 'text' },
    { id: 'district', label: 'District', type: 'text' },
    { id: 'municipality', label: 'Municipality', type: 'text' },
    { id: 'barangay', label: 'Barangay', type: 'text' },
    { id: 'zone', label: 'Zone', type: 'text' },
    { id: 'house_number', label: 'House Number', type: 'number' }
]

const addressForm = ref<AddressForm>({
    country: '',
    region: '',
    district: '',
    municipality: '',
    barangay: '',
    zone: '',
    house_number: ''
})

const loadingAddress = ref(false)
const responseAddress = ref<{ message: string; type: 'success' | 'error' | '' }>({
    message: '',
    type: ''
})

function addressShowResponse(message: string, type: 'success' | 'error') {
    response.value = { message, type }
}

async function sendUserLocationRequest(userLocation: AddressForm) {
    try {
        const res = await fetch('http://localhost:3000/signup/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userLocation)
        })
        const result = await res.json()
        if (result && result.redirectUrl) {
            window.location.href = result.redirectUrl
        } else {
            throw new Error('No redirect URL found in response')
        }
    } catch (err) {
        console.error(err)
        addressShowResponse('An error occurred while submitting the data.', 'error')
    }
}

async function handleAddressSubmit() {
    loading.value = true
    try {
        await sendUserLocationRequest(addressForm.value)
        localStorage.setItem('userLocation', JSON.stringify(form.value))
        addressShowResponse('Address submitted successfully!', 'success')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen items-center justify-center bg-gray-100 p-4">
        <div class="bg-white p-10 rounded-lg shadow-lg w-96">
            <!-- Tabs -->
            <div class="flex justify-evenly mb-6 border-b">
                <button class="pb-2 font-bold text-lg"
                    :class="activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'"
                    @click="activeTab = 'login'">
                    Login
                </button>
                <button class="pb-2 font-bold text-lg"
                    :class="activeTab === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'"
                    @click="activeTab = 'signup'">
                    Sign Up
                </button>
            </div>

            <!-- Login Form -->
            <div v-if="activeTab === 'login'">
                <h2 class="text-center text-2xl font-bold mb-6">Login</h2>
                <form @submit.prevent="handleLogin">
                    <div class="mb-4">
                        <label for="login-email" class="block font-semibold mb-2">Email</label>
                        <input id="login-email" type="email" v-model="loginForm.email"
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your email" required />
                    </div>
                    <div class="mb-6">
                        <label for="login-password" class="block font-semibold mb-2">Password</label>
                        <input id="login-password" type="password" v-model="loginForm.password"
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your password" required />
                    </div>
                    <button type="submit"
                        class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Login
                    </button>
                </form>
            </div>

            <!-- Sign Up Form -->
            <div v-else-if="activeTab === 'signup'">
                <h2 class="text-center text-2xl font-bold mb-6">Sign Up</h2>
                <form @submit.prevent="handleSignup">
                    <div class="mb-4">
                        <label for="signup-email" class="block font-semibold mb-2">Email</label>
                        <input id="signup-email" type="email" v-model="signupForm.email"
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your email" required />
                    </div>
                    <div class="mb-4">
                        <label for="signup-password" class="block font-semibold mb-2">Password</label>
                        <input id="signup-password" type="password" v-model="signupForm.password"
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your password" required />
                    </div>
                    <div class="mb-6">
                        <label for="confirm-password" class="block font-semibold mb-2">Confirm Password</label>
                        <input id="confirm-password" type="password" v-model="signupForm.confirmPassword"
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Confirm your password" required />
                    </div>
                    <button type="submit"
                        class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Sign Up
                    </button>
                </form>
            </div>

            <!-- User Information -->
            <div v-else-if="activeTab === 'information'" v-if="information"
                class="flex justify-center items-center h-auto bg-gray-100">
                <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                    <h1 class="text-center text-2xl font-bold mb-6 text-blue-600">Fill Out the Form</h1>

                    <form @submit.prevent="handleAddressSubmit">
                        <!-- First Name -->
                        <div class="mb-4">
                            <label for="firstName" class="block mb-1 font-medium text-gray-700">First Name</label>
                            <input v-model.trim="form.firstName" id="firstName" type="text"
                                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                required />
                        </div>

                        <!-- Middle Name -->
                        <div class="mb-4">
                            <label for="middleName" class="block mb-1 font-medium text-gray-700">Middle Name</label>
                            <input v-model.trim="form.middleName" id="middleName" type="text"
                                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" />
                        </div>

                        <!-- Last Name -->
                        <div class="mb-4">
                            <label for="lastName" class="block mb-1 font-medium text-gray-700">Last Name</label>
                            <input v-model.trim="form.lastName" id="lastName" type="text"
                                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                required />
                        </div>

                        <!-- Age -->
                        <div class="mb-4">
                            <label for="age" class="block mb-1 font-medium text-gray-700">Age</label>
                            <input v-model.number="form.age" id="age" type="number" min="1"
                                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                required />
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" :disabled="loading"
                            class="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50">
                            {{ loading ? 'Submitting...' : 'Submit' }}
                        </button>
                    </form>

                    <!-- Response Message -->
                    <div v-if="response.message" :class="[
                        'mt-4 p-3 rounded text-center',
                        response.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
                    ]">
                        {{ response.message }}
                    </div>
                </div>
            </div>

            <!-- User Location -->
            <div v-else-if="activeTab === 'location'" v-if="location"
                class="bg-gray-100/50 p-6 rounded-lg shadow-md w-full max-w-md">
                <h1 class="text-center text-2xl font-bold mb-6 text-blue-600">Address Form</h1>

                <form @submit.prevent="handleAddressSubmit">
                    <!-- Loop through fields to avoid repetition -->
                    <div v-for="field in fields" :key="field.id" class="mb-4 grid grid-cols-2">
                        <label :for="field.id" class="block mb-1 font-medium text-gray-700">
                            {{ field.label }}
                        </label>
                        <input v-model.trim="addressForm[field.id as keyof AddressForm]" :id="field.id"
                            :type="field.type"
                            class="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-900"
                            required />
                    </div>

                    <button type="submit" :disabled="loading"
                        class="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50">
                        {{ loading ? 'Submitting...' : 'Submit' }}
                    </button>
                </form>

                <!-- Response Message -->
                <div v-if="response.message" :class="[
                    'mt-4 p-3 rounded text-center',
                    response.type === 'success'
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-red-100 text-red-700 border border-red-300'
                ]">
                    {{ response.message }}
                </div>
            </div>
        </div>
    </div>
</template>
