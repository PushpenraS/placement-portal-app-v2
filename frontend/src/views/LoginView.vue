<template>
    <div class="container-fluid py-4">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-5">
                <div class="bg-white border rounded shadow-sm p-4">
                    <form @submit.prevent="login">
                        <div class="mb-3">
                            <label for="loginEmail" class="form-label">Email address</label>
                            <input
                                id="loginEmail"
                                v-model="email"
                                type="email"
                                class="form-control"
                                required
                            >
                        </div>
                        <div class="mb-3">
                            <label for="loginPassword" class="form-label">Password</label>
                            <input
                                id="loginPassword"
                                v-model="password"
                                type="password"
                                class="form-control"
                                @input="validatePassword"
                                required
                            >
                            <div v-if="passwordError" class="form-text">{{ passwordError }}</div>
                        </div>
                        <div v-if="loginError" class="alert alert-danger py-2" role="alert">{{ loginError }}</div>
                        <button type="submit" class="btn btn-dark w-100">Login</button>
                    </form>

                    <div class="border-top mt-4 pt-3">
                        <p class="mb-2 text-secondary">Do not have an account?</p>
                        <RouterLink class="btn btn-outline-secondary w-100" to="/register">Register</RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';

import { ref } from 'vue';

const router = useRouter()
const email = ref('');
const password = ref('');
const passwordError = ref('');
const loginError = ref('')

const validatePassword = () => {
    if (password.value.length < 6) {
        passwordError.value = 'Password must be at least 6 characters long.';
        return false
    } else {
        passwordError.value = '';
        return true
    }
}

async function login() {
    loginError.value = ''
    if (email.value === '' || password.value === '' || !validatePassword()) {
        loginError.value = 'Invalid email/password.'
        return
    }

    const user = {
        email: email.value,
        password: password.value
    };

    const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        loginError.value = `Login failed: ${errorData.message}`;
        return;
    }

    const data = await response.json();
    const authToken = data.auth_token
    const role = data.user?.role

    localStorage.setItem('auth_token', authToken || '')
    localStorage.setItem('role', role || '')

    if (role === 'candidate') {
        router.push('/dashboard/candidate')
        return
    }
    if (role === 'employer') {
        router.push('/dashboard/employer')
        return
    }
    if (role === 'admin') {
        router.push('/dashboard')
        return
    }
}

</script>
