<template>
    <div class="container-fluid py-4">
        <div class="row justify-content-center">
            <div class="col-12 col-md-9 col-lg-6">
                <div class="bg-white border rounded shadow-sm p-4">
                    <form @submit.prevent="register">
                        <div class="mb-3">
                            <label class="form-label d-block">Register As</label>
                            <div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" id="roleCandidate" value="candidate"
                                        v-model="selectedRole">
                                    <label class="form-check-label" for="roleCandidate">Candidate</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" id="roleEmployer" value="employer"
                                        v-model="selectedRole">
                                    <label class="form-check-label" for="roleEmployer">Employer</label>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="registerEmail" class="form-label">Email address</label>
                            <input
                                id="registerEmail"
                                v-model="email_info"
                                type="email"
                                class="form-control"
                                @input="isValidEmail"
                                required
                            >
                            <div v-if="emailAvailabilityMessage" class="form-text">{{ emailAvailabilityMessage }}</div>
                        </div>
                        <div class="mb-3">
                            <label for="registerPassword" class="form-label">Password</label>
                            <input
                                id="registerPassword"
                                v-model="pwd_info"
                                type="password"
                                class="form-control"
                                @input="isValidPassword"
                                required
                            >
                            <div v-if="pwdValididityMessage" class="form-text">{{ pwdValididityMessage }}</div>
                        </div>
                        <div class="mb-3">
                            <label for="registerName" class="form-label">
                                {{ selectedRole === 'candidate' ? 'Full Name' : 'Company Name' }}
                            </label>
                            <input
                                id="registerName"
                                v-model="name"
                                type="text"
                                class="form-control"
                                @input="isValidName"
                                required
                            >
                            <div class="form-text">{{ nameValidityMessage }}</div>
                        </div>
                        <div v-if="registrationError" class="alert alert-danger py-2" role="alert">{{ registrationError }}</div>
                        <div v-if="registrationSuccess" class="alert alert-success py-2" role="alert">{{ registrationSuccess }}</div>
                        <button type="submit" class="btn btn-dark w-100" :disabled="!isFormValid">Register</button>
                    </form>

                    <div class="border-top mt-4 pt-3">
                        <p class="mb-2 text-secondary">Already have an account?</p>
                        <RouterLink class="btn btn-outline-secondary w-100" to="/login">Go to Login</RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

const email_info = ref('')
const pwd_info = ref('')
const name = ref('')
const selectedRole = ref('candidate')
const emailAvailabilityMessage = ref('')
const pwdValididityMessage = ref('')
const nameValidityMessage = ref('')
const registrationError = ref('')
const registrationSuccess = ref('')
const emailAvailable = ref(false)
const isCheckingEmail = ref(false)


const isValidName = () => {
    if (name.value.trim().length == 0) {
        nameValidityMessage.value =
            selectedRole.value === 'candidate'
                ? "Enter a valid Candidate Name"
                : "Enter a valid Company Name";
        return false;
    } else {
        nameValidityMessage.value = '';
        return true;
    }
}

const isValidPassword = () => {
    if (pwd_info.value.length < 6) {
        pwdValididityMessage.value = "Password must be at least 6 characters long.";
        return false;
    } else {
        pwdValididityMessage.value = '';
        return true;
    }
}

const isValidEmail = () => {
    if (email_info.value.includes('@')) {
        isCheckingEmail.value = true;
        fetch("http://127.0.0.1:5000/api/check-email", {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email: email_info.value })
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error('Error checking email availability.')
                emailAvailable.value = false;
                isCheckingEmail.value = false;
            }
        }).then(data => {
            if (!data) {
                return;
            }
            if (data.available) {
                emailAvailabilityMessage.value = 'email is available';
                emailAvailable.value = true;
                return true;
            } else {
                emailAvailabilityMessage.value = 'email adress already registered';
                emailAvailable.value = false;
                return false;
            }
        }).finally(() => {
            isCheckingEmail.value = false;
        });
    } else {
        emailAvailabilityMessage.value = 'Invalid email address.';
        emailAvailable.value = false;
        isCheckingEmail.value = false;
        return false;
    }
}

const isFormValid = computed(() =>
    email_info.value.includes('@') &&
    emailAvailable.value &&
    !isCheckingEmail.value &&
    pwd_info.value.length > 1 &&
    name.value.trim().length > 0
)

async function register() {  
    registrationError.value = ''
    registrationSuccess.value = ''
    let response = null;

    if (!isFormValid.value) {
        registrationError.value = "Invalid email, name, or password."
        return;
    }

    if (selectedRole.value == 'candidate') {
        response = await register_candidate()
    } else {
        response = await register_employer()
    }    

    if (!response.ok) {
        const errorData = await response.json();
        registrationError.value = `Registration failed: ${errorData.message}`;
        return;
    } else {
        await response.json();
        registrationSuccess.value = 'Account registration was successful.'
        return;
    }
}

async function register_candidate() {
    const new_candidate = {
        email: email_info.value,
        password: pwd_info.value,
        full_name: name.value
    };

    return fetch("http://127.0.0.1:5000/api/register/candidate", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(new_candidate)
    });
}

async function register_employer() {
    const new_employer = {
        email: email_info.value,
        password: pwd_info.value,
        name: name.value
    };

    return fetch("http://127.0.0.1:5000/api/register/employer", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(new_employer)
    });
}
</script>
