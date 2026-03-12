<template>
    <tr>
        <th scope="row" class="col-md-2">{{ drive.drive_id }}</th>
        <td class="col-md-6">{{ drive.name }}</td>
        <td class="col-md-4">
            <div class="d-flex justify-content-center gap-2 flex-wrap">
                <button class="btn btn-outline-success btn-sm" @click="emit('view-drive-details', drive.drive_id)">View Details - {{ drive.drive_id }}</button>
                <template v-if="mode === 'pending'">
                    <button class="btn btn-outline-success btn-sm" @click="updateDrive('approve')">Approve</button>
                    <button class="btn btn-outline-danger btn-sm" @click="updateDrive('reject')">Reject</button>
                </template>
                <button v-else class="btn btn-outline-danger btn-sm" @click="updateDrive('mark_complete')">Mark as Complete</button>
            </div>
        </td>
    </tr>
</template>
<script setup>
const emit = defineEmits(['refresh-drives', 'view-drive-details'])
const props = defineProps({
    drive: {
        type: Object,
        required: true
    },
    mode: {
        type: String,
        default: 'ongoing'
    }
})

function authHeaders() {
    return {
        'content-type': 'application/json',
        'Authentication-Token': localStorage.getItem('auth_token') || ''
    }
}

async function updateDrive(action) {
    const response = await fetch(
        `http://127.0.0.1:5000/api/admin/drive/${props.drive?.drive_id}`,
        {
            method: 'PATCH',
            headers: authHeaders(),
            body: JSON.stringify({ action })
        }
    )

    if (!response.ok) {
        alert('Something went awry')
        return
    }

    await response.json()
    emit('refresh-drives')
    const actionLabel = action === 'mark_complete' ? 'marked as complete' : `${action}d`
    alert(`Drive ${props.drive?.drive_id} ${actionLabel}.`)
}
</script>
