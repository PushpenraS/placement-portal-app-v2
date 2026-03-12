<template>
    <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>{{ candidate.full_name }}</span>
        <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-outline-success btn-sm" :disabled="isActive" @click="updateCandidate('activate')">Activate - {{ candidate.candidate_id }}</button>
            <button class="btn btn-outline-danger btn-sm" :disabled="!isActive" @click="updateCandidate('deactivate')">Deactivate - {{ candidate.candidate_id }}</button>
        </div>
    </li>
</template>
<script setup>
import { computed } from 'vue';

const emit = defineEmits(['refresh-candidates'])
const props = defineProps(['candidate'])
const isActive = computed(() => props.candidate?.active)

function authHeaders() {
    return {
        'content-type': 'application/json',
        'Authentication-Token': localStorage.getItem('auth_token') || ''
    }
}

async function updateCandidate(action) {
    const response = await fetch("http://127.0.0.1:5000/api/admin/candidate", {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ candidate_id: props.candidate?.candidate_id, action })
    });

    if (!response.ok) {
        alert('Something went awry')
        return;
    }

    await response.json()
    emit('refresh-candidates', { action })
    alert(`Candidate: ${props.candidate?.full_name} has been ${action}d.`)
}
</script>
