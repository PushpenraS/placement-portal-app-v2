<template>
    <tr>
        <th scope="row" class="col-md-1">{{ application.application_id }}</th>
        <td class="col-md-2">{{ application.candidate_name }}</td>
        <td class="col-md-4">{{ application.drive_name }}</td>
        <td class="col-md-2">{{ application.employer_name }}</td>
        <td class="col-md-1">{{ application.applied_at }}</td>
        <td class="col-md-1">
            <div class="d-flex justify-content-center gap-2 flex-wrap">
                <button class="btn btn-outline-success btn-sm" @click="emit('view-application-details', application.application_id)">View Details</button>
            </div>
        </td>
    </tr>

</template>

<script setup>
const emit = defineEmits(['view-application-details'])
defineProps(['application'])

</script>
