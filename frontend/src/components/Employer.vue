<template>

        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>{{ employer.name }}</span>
            
            <div v-if="isApproved" class="d-flex gap-2 flex-wrap">
                <button class="btn btn-outline-success btn-sm" :disabled="isActive" @click="updateEmployer('activate')">Activate - {{ employer.employer_id }}</button>
                <button class="btn btn-outline-danger btn-sm" :disabled="!isActive" @click="updateEmployer('deactivate')">Deactivate - {{ employer.employer_id }}</button>
            </div>
            <div v-else>
                <button class="btn btn-outline-success btn-sm" @click="updateEmployer('approve')">Approve - {{ employer.employer_id }}</button>
            </div>
        </li>
</template>
<script setup>

import { computed, defineEmits } from 'vue';

const emit = defineEmits(['refresh-employers'])
const props = defineProps(['employer'])

const isApproved = computed(() => props.employer?.approval_status === 'approved')
const isActive = computed(() => props.employer?.approval_status === 'approved' && props.employer?.active)

function authHeaders() {
    return {
        'content-type': 'application/json',
        'Authentication-Token': localStorage.getItem('auth_token') || ''
    }
}

async function updateEmployer(action) {
    const response = await fetch("http://127.0.0.1:5000/api/admin/employer", {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({employer_id : props.employer?.employer_id, action: action})
    });

    if (!response.ok) {
        alert('Something went awry')
        return;
    }

    const data = await response.json()
    emit('refresh-employers', {action})
    alert(`Employer : ${props.employer?.name} has been ${action}d.`)
}
</script>
