<script setup lang="ts">
import { ref, toRefs } from 'vue'
import axios from 'axios'
import { user } from '@/stores/user';
import { type User } from '@/stores/user';

type ValidationResult = { isValid: boolean; message?: string }

const activeTab = ref<'login' | 'signup' | 'information' | 'location'>('information')
const information = ref<boolean>(true)
const location = ref<boolean>(false)

// Login form state
const loginForm = ref({ email: '', password: '' })
const loginError = ref<string | null>(null)

// Signup form state
const signupForm = ref({ email: '', password: '', confirmPassword: '', username: '' })
const signupError = ref<string | null>(null)

// Validation
function validateForm(
  email: string,
  password: string,
  confirmPassword?: string
): ValidationResult {
  if (!email || !password || (confirmPassword !== undefined && confirmPassword.trim() === '')) {
    return { isValid: false, message: 'All fields are required!' }
  }
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
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

// ============================================
// Axios Submit Helper
// ============================================
async function submitForm(url: string, data: Record<string, any>, useAuth: boolean = false) {
  try {
    const token = localStorage.getItem('jwt_token')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (useAuth && token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await axios.post(url, data, { headers })
    return { status: response.status, data: response.data }
  } catch (err: any) {
    return {
      status: err.response?.status || 500,
      data: err.response?.data || { error: 'Network error' }
    }
  }
}

// ============================================
// Handle Signup - Store JWT Token
// ============================================
async function handleSignup() {
  signupError.value = null
  const { email, password, confirmPassword } = toRefs(signupForm.value)

  const validation = validateForm(email.value, password.value, confirmPassword.value)
  if (!validation.isValid) {
    signupError.value = validation.message || 'Invalid form data'
    return
  }

  const { status, data } = await submitForm(
    'http://localhost:3000/signup',
    { email: email.value, password: password.value }
  )

  if (status === 200) {
    localStorage.setItem('jwt_token', data.token)
    localStorage.setItem('user_id', data.user_id)
    activeTab.value = 'information'
    information.value = true
    console.log('Signup successful, token stored')
  } else {
    signupError.value = data.error || 'Signup failed'
  }
}

// ============================================
// Handle Login
// ============================================
async function handleLogin() {
  loginError.value = null
  const { email, password } = loginForm.value

  const validation = validateForm(email, password)
  if (!validation.isValid) {
    loginError.value = validation.message || 'Invalid form data'
    return
  }

  const { status, data } = await submitForm(
    'http://localhost:3000/login',
    { email: email, password }
  )
  console.log(status, data);

  if (status === 200 && data.token) {
    localStorage.setItem('jwt_token', data.token)
    if (data.user_id) localStorage.setItem('user_id', data.user_id)
    if (data.messages) localStorage.setItem('messageData', JSON.stringify(data.messages))
    if (data.userInfo) {
      localStorage.setItem("userInfo", data.userInfo);
      user.value = data.userInfo as User;
    }

    if (data.messages) {
      const contact = [...new Set(data.messages.map((msg: any) => msg.conversationID))]
      localStorage.setItem('contact', JSON.stringify(contact))
    }

    window.location.href = `/`
  } else {
    loginError.value = data.error || 'Login failed'
  }
}

// ============================================
// User Information
// ============================================
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

async function informationHandleSubmit() {
  if (!userCredentialValidateForm()) return
  loading.value = true
  response.value = { message: '', type: '' }

  const { status, data } = await submitForm(
    'http://localhost:3000/signup/information',
    form.value,
    true // useAuth = true
  )

  if (status !== 200) {
    showInformationResponse(data.error || 'Submission failed. Please try again.', 'error')
  } else {
    localStorage.setItem('userInfo', JSON.stringify(form.value))
    activeTab.value = 'location'
    information.value = false
    location.value = true
    showInformationResponse(
      `Thank you, ${form.value.firstName} ${form.value.middleName ? form.value.middleName + ' ' : ''}${form.value.lastName}!`,
      'success'
    )
  }

  loading.value = false
}

// ============================================
// User Location
// ============================================
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
  responseAddress.value = { message, type }
}

async function handleAddressSubmit() {
  loadingAddress.value = true

  const { status, data } = await submitForm(
    'http://localhost:3000/signup/location',
    addressForm.value,
    true // useAuth = true
  )

  if (status === 200 && data.redirectUrl) {
    localStorage.setItem('userLocation', JSON.stringify(addressForm.value))
    window.location.href = data.redirectUrl
  } else {
    addressShowResponse(data.error || 'Submission failed. Please try again.', 'error')
  }

  loadingAddress.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

      <!-- Tabs -->
      <div class="flex mb-8 bg-gray-100 rounded-lg overflow-hidden">
        <button class="flex-1 py-3 text-center font-semibold transition-colors" :class="activeTab === 'login'
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-200'" @click="activeTab = 'login'">
          Login
        </button>
        <button class="flex-1 py-3 text-center font-semibold transition-colors" :class="activeTab === 'signup'
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-200'" @click="activeTab = 'signup'">
          Sign Up
        </button>
      </div>

      <!-- Login Form -->
      <div v-if="activeTab === 'login'">
        <h2 class="text-center text-2xl font-bold mb-6 text-blue-700">Welcome Back</h2>
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="login-email" class="block text-xs font-medium text-gray-700">Email</label>
            <input id="login-email" type="email" v-model="loginForm.email"
              class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your email" required />
          </div>
          <div>
            <label for="login-password" class="block text-xs font-medium text-gray-700">Password</label>
            <input id="login-password" type="password" v-model="loginForm.password"
              class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your password" required />
          </div>
          <button type="submit"
            class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Login
          </button>
        </form>
      </div>

      <!-- Sign Up Form -->
      <div v-else-if="activeTab === 'signup'">
        <h2 class="text-center text-2xl font-bold mb-6 text-blue-700">Create Account</h2>
        <form @submit.prevent="handleSignup" class="space-y-5">
          <div>
            <label for="confirm-password" class="block text-xs font-medium text-gray-700">Username</label>
            <input id="username" type="text" v-model="signupForm.username"
              class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Username" required />
          </div>
          <div>
            <label for="signup-email" class="block text-xs font-medium text-gray-700">Email</label>
            <input id="signup-email" type="email" v-model="signupForm.email"
              class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your email" required />
          </div>
          <div>
            <label for="signup-password" class="block text-xs font-medium text-gray-700">Password</label>
            <input id="signup-password" type="password" v-model="signupForm.password"
              class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your password" required />
          </div>
          <div>
            <label for="confirm-password" class="block text-xs font-medium text-gray-700">Confirm Password</label>
            <input id="confirm-password" type="password" v-model="signupForm.confirmPassword"
              class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Confirm your password" required />
          </div>
          <button type="submit"
            class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Sign Up
          </button>
        </form>
      </div>

      <!-- Information Form -->
      <div v-else-if="activeTab === 'information'" v-if="information">
        <h2 class="text-center text-2xl font-bold mb-6 text-blue-700">Your Information</h2>
        <form @submit.prevent="informationHandleSubmit()" class="space-y-5">
          <div>
            <label for="firstName" class="block text-xs font-medium text-gray-700">First Name</label>
            <input id="firstName" v-model.trim="form.firstName" type="text"
              class="mt-1 w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label for="middleName" class="block text-xs font-medium text-gray-700">Middle Name</label>
            <input id="middleName" v-model.trim="form.middleName" type="text"
              class="mt-1 w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label for="lastName" class="block text-xs font-medium text-gray-700">Last Name</label>
            <input id="lastName" v-model.trim="form.lastName" type="text"
              class="mt-1 w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label for="age" class="block text-xs font-medium text-gray-700">Age</label>
            <input id="age" v-model.number="form.age" type="number" min="1"
              class="mt-1 w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400" required />
          </div>
          <button type="submit" :disabled="loading"
            class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {{ loading ? 'Submitting...' : 'Submit' }}
          </button>
        </form>
      </div>

      <!-- Location Form -->
      <div v-else-if="activeTab === 'location'" v-if="location">
        <h2 class="text-center text-2xl font-bold mb-6 text-blue-700">Address Information</h2>
        <form @submit.prevent="handleAddressSubmit" class="space-y-5">
          <div v-for="field in fields" :key="field.id">
            <label :for="field.id" class="block text-xs font-medium text-gray-700">{{ field.label }}</label>
            <input :id="field.id" v-model.trim="addressForm[field.id as keyof AddressForm]" :type="field.type"
              class="mt-1 w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400" required />
          </div>
          <button type="submit" :disabled="loading"
            class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {{ loading ? 'Submitting...' : 'Submit' }}
          </button>
        </form>
      </div>

      <!-- Response -->
      <div v-if="response.message" class="mt-6">
        <p :class="[
          'text-center px-4 py-2 rounded-lg font-medium',
          response.type === 'success'
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300'
        ]">
          {{ response.message }}
        </p>
      </div>
    </div>
  </div>
</template>
