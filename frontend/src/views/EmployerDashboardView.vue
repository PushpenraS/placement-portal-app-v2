<template>
    <div class="card mt-2 mb-2 border-dark">
        <div class="card-header d-flex justify-content-between align-items-center">
            <div>
                <div class="fw-semibold">{{ employerProfile.name }}</div>
                <small class="text-muted">{{ employerProfile.industry || 'No industry added' }}</small>
            </div>
            <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-secondary" @click="openEditProfileOverlay">Edit Profile</button>
                <button class="btn btn-sm btn-primary" :disabled="!profileComplete" @click="openCreateDriveOverlay">Create Drive</button>
            </div>
        </div>
        <div class="card-body">
            <div v-if="!profileComplete" class="alert alert-warning py-2 mb-3">
                Complete your profile to create a drive.
            </div>
            <div class="row g-3">
                <div class="col-md-4">
                    <div class="p-2 border rounded bg-light">
                        <div class="small text-muted">Location</div>
                        <div>{{ employerProfile.location || '-' }}</div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-2 border rounded bg-light">
                        <div class="small text-muted">Website</div>
                        <div>
                            <a v-if="employerProfile.website" :href="employerProfile.website" target="_blank" rel="noopener noreferrer">
                                {{ employerProfile.website }}
                            </a>
                            <span v-else>-</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-2 border rounded bg-light">
                        <div class="small text-muted">Approval Status</div>
                        <div class="text-capitalize">{{ employerProfile.approval_status || '-' }}</div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="p-2 border rounded bg-light">
                        <div class="small text-muted">About</div>
                        <div>{{ employerProfile.about || '-' }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card mt-2 mb-2 border-dark">
        <div class="card-header d-flex justify-content-between align-items-center">
            <span>My Ongoing Drives</span>
        </div>
        <div class="container-fluid pt-2">
            <table class="table table-bordered text-center align-middle">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Drive Name</th>
                        <th scope="col">Job Title</th>
                        <th scope="col">Deadline</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="drive in ongoingDrives" :key="drive.drive_id">
                        <th scope="row">{{ drive.drive_id }}</th>
                        <td>{{ drive.name }}</td>
                        <td>{{ drive.job_title }}</td>
                        <td>{{ drive.application_deadline }}</td>
                        <td>
                            <button class="btn btn-outline-success btn-sm me-2"
                                @click="openDriveApplications(drive.drive_id)">View Applications</button>
                            <button class="btn btn-outline-danger btn-sm"
                                @click="markDriveComplete(drive.drive_id)">Mark Complete</button>
                        </td>
                    </tr>
                    <tr v-if="ongoingDrives.length === 0">
                        <td colspan="5" class="text-muted">No ongoing drives.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="card mt-2 mb-2 border-dark">
        <div class="card-header">Pending Drive Approvals</div>
        <div class="container-fluid pt-2">
            <table class="table table-bordered text-center align-middle">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Drive Name</th>
                        <th scope="col">Job Title</th>
                        <th scope="col">Deadline</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="drive in pendingDrives" :key="drive.drive_id">
                        <th scope="row">{{ drive.drive_id }}</th>
                        <td>{{ drive.name }}</td>
                        <td>{{ drive.job_title }}</td>
                        <td>{{ drive.application_deadline }}</td>
                        <td class="text-capitalize">{{ drive.status }}</td>
                    </tr>
                    <tr v-if="pendingDrives.length === 0">
                        <td colspan="5" class="text-muted">No drives awaiting approval.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="card mt-2 mb-2 border-dark">
        <div class="card-header">Closed Drives</div>
        <div class="container-fluid pt-2">
            <table class="table table-bordered text-center align-middle">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Drive Name</th>
                        <th scope="col">Job Title</th>
                        <th scope="col">Deadline</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="drive in closedDrives" :key="drive.drive_id">
                        <th scope="row">{{ drive.drive_id }}</th>
                        <td>{{ drive.name }}</td>
                        <td>{{ drive.job_title }}</td>
                        <td>{{ drive.application_deadline }}</td>
                        <td class="text-capitalize">{{ drive.status }}</td>
                    </tr>
                    <tr v-if="closedDrives.length === 0">
                        <td colspan="5" class="text-muted">No closed drives.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- CHANGE START: Create Drive Overlay -->
    <div v-if="showCreateDriveOverlay" class="overlay-backdrop" @click.self="closeCreateDriveOverlay">
        <div class="overlay-card card border-dark">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>Create Drive</span>
                <button class="btn btn-sm btn-outline-secondary" @click="closeCreateDriveOverlay">X</button>
            </div>
            <div class="card-body">
                <form @submit.prevent="createDrive">
                    <div class="mb-2">
                        <label class="form-label">Drive Name</label>
                        <input class="form-control" v-model="createDriveForm.name" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Job Title</label>
                        <input class="form-control" v-model="createDriveForm.job_title" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Job Description</label>
                        <textarea class="form-control" rows="3" v-model="createDriveForm.job_description" required></textarea>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Location</label>
                        <input class="form-control" v-model="createDriveForm.location" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Eligibility Criteria</label>
                        <textarea class="form-control" rows="2" v-model="createDriveForm.eligibility_criteria" required></textarea>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Application Deadline</label>
                        <input class="form-control" type="date" v-model="createDriveForm.application_deadline" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Salary</label>
                        <input class="form-control" type="number" min="0" step="1" v-model.number="createDriveForm.salary" required>
                    </div>
                    <div class="d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-outline-secondary" @click="closeCreateDriveOverlay">Cancel</button>
                        <button type="submit" class="btn btn-primary">Create</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- CHANGE END: Create Drive Overlay -->

    <!-- CHANGE START: Employer Applications Overlay -->
    <div v-if="showApplicationsOverlay" class="overlay-backdrop" @click.self="closeApplicationsOverlay">
        <div class="overlay-card overlay-card-wide card border-dark">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Applications for {{ driveApplicationsData.drive_name }}</h5>
                <button class="btn btn-sm btn-outline-secondary" @click="closeApplicationsOverlay">X</button>
            </div>
            <div class="card-body">
                <div class="row g-3 mb-3">
                    <div class="col-md-4">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Drive ID</div>
                            <div>{{ driveApplicationsData.drive_id }}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Drive Name</div>
                            <div>{{ driveApplicationsData.drive_name }}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Job Title</div>
                            <div>{{ driveApplicationsData.job_title }}</div>
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-content-end mb-3">
                    <select class="form-select" style="max-width: 220px;" v-model="applicationFilterStatus" @change="loadDriveApplications">
                        <option value="all">All Applications</option>
                        <option value="active">Active Applications</option>
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="selected">Selected</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <table class="table table-bordered text-center align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Application #</th>
                            <th scope="col">Candidate Name</th>
                            <th scope="col">Applied At</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="application in driveApplicationsData.applications" :key="application.application_id">
                            <th scope="row">{{ application.application_id }}</th>
                            <td>{{ application.candidate_name }}</td>
                            <td>{{ application.applied_at || '-' }}</td>
                            <td class="text-capitalize">{{ application.status }}</td>
                            <td>
                                <button class="btn btn-outline-danger btn-sm"
                                    @click="openApplicationDetailsOverlay(application.application_id)">Review</button>
                            </td>
                        </tr>
                        <tr v-if="driveApplicationsData.applications.length === 0">
                            <td colspan="5" class="text-muted">No applications found for this drive.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="card-footer d-flex justify-content-end">
                <button class="btn btn-outline-secondary" @click="closeApplicationsOverlay">Back</button>
            </div>
        </div>
    </div>
    <!-- CHANGE END: Employer Applications Overlay -->

    <!-- CHANGE START: Employer Application Details Overlay -->
    <div v-if="showApplicationDetailsOverlay" class="overlay-backdrop overlay-backdrop-top" @click.self="closeApplicationDetailsOverlay">
        <div class="overlay-card card border-dark">
            <div class="card-header d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="mb-0">Candidate Application Details</h5>
                    <small class="text-muted">Application #{{ applicationDetails.application_id }}</small>
                </div>
                <button class="btn btn-sm btn-outline-secondary" @click="closeApplicationDetailsOverlay">X</button>
            </div>
            <div class="card-body">
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Candidate Name</div>
                            <div>{{ applicationDetails.candidate.full_name }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Current Status</div>
                            <div class="text-capitalize">{{ applicationDetails.status }}</div>
                        </div>
                    </div>
                </div>

                <h6 class="mb-2">Drive Details</h6>
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Drive ID</div>
                            <div>{{ applicationDetails.drive.drive_id }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Drive Name</div>
                            <div>{{ applicationDetails.drive.name }}</div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Job Title</div>
                            <div>{{ applicationDetails.drive.job_title }}</div>
                        </div>
                    </div>
                </div>

                <h6 class="mb-2">Candidate Profile</h6>
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Qualification</div>
                            <div>{{ applicationDetails.candidate.qualification }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Skills</div>
                            <div>{{ applicationDetails.candidate.skills }}</div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Resume Path</div>
                            <div>
                                <a v-if="applicationDetails.candidate.resume_path" :href="applicationDetails.candidate.resume_path" target="_blank" rel="noopener noreferrer">
                                    View Resume
                                </a>
                                <span v-else>-</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer d-flex justify-content-end gap-2">
                <select class="form-select" style="max-width: 220px;" v-model="selectedApplicationStatus">
                    <option value="applied" disabled>Update Status</option>
                    <option value="shortlisted">shortlist</option>
                    <option value="selected">select</option>
                    <option value="rejected">reject</option>
                </select>
                <button class="btn btn-outline-primary" @click="updateApplicationStatus">Update</button>
                <button class="btn btn-outline-secondary" @click="closeApplicationDetailsOverlay">Back</button>
            </div>
        </div>
    </div>
    <!-- CHANGE END: Employer Application Details Overlay -->

    <!-- CHANGE START: Employer Edit Profile Overlay -->
    <div v-if="showEditProfileOverlay" class="overlay-backdrop overlay-backdrop-top" @click.self="closeEditProfileOverlay">
        <div class="overlay-card card border-dark">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>Edit Profile</span>
                <button class="btn btn-sm btn-outline-secondary" @click="closeEditProfileOverlay">X</button>
            </div>
            <div class="card-body">
                <div class="mb-2">
                    <label class="form-label">Employer Name</label>
                    <input class="form-control" :value="editProfile.name" readonly>
                </div>
                <div class="mb-2">
                    <label class="form-label">Industry</label>
                    <input class="form-control" v-model="editProfile.industry">
                </div>
                <div class="mb-2">
                    <label class="form-label">Location</label>
                    <input class="form-control" v-model="editProfile.location">
                </div>
                <div class="mb-2">
                    <label class="form-label">Website</label>
                    <input class="form-control" v-model="editProfile.website">
                </div>
                <div class="mb-2">
                    <label class="form-label">About</label>
                    <textarea class="form-control" rows="3" v-model="editProfile.about"></textarea>
                </div>
            </div>
            <div class="card-footer d-flex justify-content-end gap-2">
                <button class="btn btn-outline-primary" @click="saveEditProfile">Save</button>
                <button class="btn btn-outline-secondary" @click="closeEditProfileOverlay">Back</button>
            </div>
        </div>
    </div>
    <!-- CHANGE END: Employer Edit Profile Overlay -->

</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const ongoingDrives = ref([])
const pendingDrives = ref([])
const closedDrives = ref([])
const employerProfile = ref({
    employer_id: '-',
    name: '-',
    approval_status: '-',
    active: false,
    about: '',
    industry: '',
    location: '',
    website: ''
})
const selectedDriveId = ref(null)
const driveApplicationsData = ref({
    drive_id: '-',
    drive_name: 'Drive Name',
    job_title: 'Job Title',
    applications: []
})

// CHANGE START: Create Drive Overlay
const showCreateDriveOverlay = ref(false)
const createDriveForm = ref({
    name: '',
    job_title: '',
    job_description: '',
    location: '',
    eligibility_criteria: '',
    application_deadline: '',
    salary: null
})
// CHANGE END: Create Drive Overlay

// CHANGE START: Employer Applications Overlay
const showApplicationsOverlay = ref(false)
const applicationFilterStatus = ref('all')
// CHANGE END: Employer Applications Overlay

// CHANGE START: Employer Application Details Overlay
const showApplicationDetailsOverlay = ref(false)
const selectedApplicationStatus = ref('applied')
const lastApplicationStatus = ref('applied')
const applicationDetails = ref({
    application_id: '-',
    status: 'applied',
    candidate: {
        candidate_id: '-',
        full_name: '-',
        qualification: '-',
        skills: '-',
        resume_path: '-'
    },
    drive: {
        drive_id: '-',
        name: '-',
        job_title: '-',
        employer_id: '-'
    }
})
// CHANGE END: Employer Application Details Overlay

// CHANGE START: Employer Edit Profile Overlay
const showEditProfileOverlay = ref(false)
const editProfile = ref({
    name: '-',
    industry: '',
    location: '',
    website: '',
    about: ''
})
// CHANGE END: Employer Edit Profile Overlay

const profileComplete = computed(() => {
    const profile = employerProfile.value
    return [profile.name, profile.industry, profile.location, profile.website, profile.about]
        .every((value) => value && String(value).trim())
})

function authHeaders() {
    return {
        'content-type': 'application/json',
        'Authentication-Token': localStorage.getItem('auth_token') || ''
    }
}

onMounted(() => {
    refreshAll()
    loadEmployerProfile()
    syncOverlayFromQuery()
})

watch(
    () => route.query.panel,
    () => {
        syncOverlayFromQuery()
    }
)

function refreshAll() {
    return Promise.all([
        getDrivesByStatus('pending').then(pd => pendingDrives.value = pd || []),
        getDrivesByStatus('ongoing').then(od => ongoingDrives.value = od || []),
        getDrivesByStatus('closed').then(cd => closedDrives.value = cd || [])
    ])
}

async function loadEmployerProfile() {
    const response = await fetch(`http://127.0.0.1:5000/api/employer/profile`, {
        method: 'GET',
        headers: authHeaders()
    })

    if (!response.ok) {
        return
    }

    const data = await response.json()
    employerProfile.value = {
        employer_id: data.employer_id ?? '-',
        name: data.name || '-',
        approval_status: data.approval_status || '-',
        active: Boolean(data.active),
        about: data.about || '',
        industry: data.industry || '',
        location: data.location || '',
        website: data.website || ''
    }
}
async function getDrivesByStatus(status) {
    const response = await fetch(
        `http://127.0.0.1:5000/api/employer/drive?status=${status}`,
        {
            method: 'GET',
            headers: authHeaders()
        }
    )

    if (!response.ok) {
        return []
    }

    return await response.json()
}

async function markDriveComplete(driveId) {
    const response = await fetch(`http://127.0.0.1:5000/api/employer/drive/item/${driveId}`, {
        method: 'PATCH',
        headers: authHeaders()
    })

    if (!response.ok) {
        alert('Could not mark drive complete.')
        return
    }

    await response.json()
    await refreshAll()
    if (selectedDriveId.value === driveId) {
        closeApplicationsOverlay()
        selectedDriveId.value = null
    }
}

async function openDriveApplications(driveId) {
    selectedDriveId.value = driveId
    applicationFilterStatus.value = 'all'
    showApplicationsOverlay.value = true
    await loadDriveApplications()
}

async function loadDriveApplications() {
    if (!selectedDriveId.value) {
        driveApplicationsData.value = {
            drive_id: '-',
            drive_name: 'Drive Name',
            job_title: 'Job Title',
            applications: []
        }
        return
    }

    const response = await fetch(
        `http://127.0.0.1:5000/api/employer/drive/${selectedDriveId.value}/application?status=${applicationFilterStatus.value}`,
        {
            method: 'GET',
            headers: authHeaders()
        }
    )

    if (!response.ok) {
        driveApplicationsData.value = {
            drive_id: '-',
            drive_name: 'Drive Name',
            job_title: 'Job Title',
            applications: []
        }
        return
    }

    const payload = await response.json()
    driveApplicationsData.value = {
        drive_id: payload.drive_id,
        drive_name: payload.drive_name,
        job_title: payload.job_title,
        applications: payload.applications || []
    }
}

// CHANGE START: Create Drive Overlay
function openCreateDriveOverlay() {
    if (!profileComplete.value) {
        alert('Complete your profile to create a drive.')
        return
    }
    showCreateDriveOverlay.value = true
}

function closeCreateDriveOverlay() {
    showCreateDriveOverlay.value = false
    createDriveForm.value = {
        name: '',
        job_title: '',
        job_description: '',
        location: '',
        eligibility_criteria: '',
        application_deadline: '',
        salary: null
    }
}

async function createDrive() {
    const payload = {
        name: createDriveForm.value.name,
        job_title: createDriveForm.value.job_title,
        job_description: createDriveForm.value.job_description,
        location: createDriveForm.value.location,
        eligibility_criteria: createDriveForm.value.eligibility_criteria,
        application_deadline: createDriveForm.value.application_deadline,
        salary: createDriveForm.value.salary
    }

    const response = await fetch(`http://127.0.0.1:5000/api/employer/drive`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload)
    })

    const data = await response.json()
    if (!response.ok) {
        alert(data.message || 'Could not create drive.')
        return
    }

    closeCreateDriveOverlay()
    await loadEmployerProfile()
    await refreshAll()
}
// CHANGE END: Create Drive Overlay

// CHANGE START: Employer Applications Overlay
function closeApplicationsOverlay() {
    showApplicationsOverlay.value = false
    closeApplicationDetailsOverlay()
    applicationFilterStatus.value = 'all'
    driveApplicationsData.value = {
        drive_id: '-',
        drive_name: 'Drive Name',
        job_title: 'Job Title',
        applications: []
    }
}
// CHANGE END: Employer Applications Overlay

// CHANGE START: Employer Application Details Overlay
async function openApplicationDetailsOverlay(applicationId) {
    const response = await fetch(`http://127.0.0.1:5000/api/employer/application/${applicationId}`, {
        method: 'GET',
        headers: authHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        alert(data.message || 'Could not retrieve application details.')
        return
    }

    applicationDetails.value = data
    lastApplicationStatus.value = data.status
    selectedApplicationStatus.value = data.status
    showApplicationDetailsOverlay.value = true
}

async function updateApplicationStatus() {
    if (
        !applicationDetails.value.application_id ||
        selectedApplicationStatus.value === lastApplicationStatus.value
    ) {
        return
    }

    const response = await fetch(
        `http://127.0.0.1:5000/api/employer/application/${applicationDetails.value.application_id}`,
        {
            method: 'PATCH',
            headers: authHeaders(),
            body: JSON.stringify({
                status: selectedApplicationStatus.value
            })
        }
    )

    const data = await response.json()
    if (!response.ok) {
        alert(data.message || 'Could not update application status.')
        return
    }

    applicationDetails.value.status = data.details?.status || selectedApplicationStatus.value
    lastApplicationStatus.value = applicationDetails.value.status

    const item = driveApplicationsData.value.applications.find(
        (application) => application.application_id === applicationDetails.value.application_id
    )
    if (item) {
        item.status = applicationDetails.value.status
    }
    await loadDriveApplications()
}

function closeApplicationDetailsOverlay() {
    showApplicationDetailsOverlay.value = false
    selectedApplicationStatus.value = 'applied'
    lastApplicationStatus.value = 'applied'
    applicationDetails.value = {
        application_id: '-',
        status: 'applied',
        candidate: {
            candidate_id: '-',
            full_name: '-',
            qualification: '-',
            skills: '-',
            resume_path: '-'
        },
        drive: {
            drive_id: '-',
            name: '-',
            job_title: '-',
            employer_id: '-'
        }
    }
}
// CHANGE END: Employer Application Details Overlay

// CHANGE START: Employer Edit Profile Overlay
function syncOverlayFromQuery() {
    const isEditProfile = route.query.panel === 'edit_profile'
    showEditProfileOverlay.value = isEditProfile
    if (isEditProfile) {
        loadEmployerProfileForEdit()
    }
}

function openEditProfileOverlay() {
    router.replace({
        query: {
            ...route.query,
            panel: 'edit_profile'
        }
    })
}

async function loadEmployerProfileForEdit() {
    if (!employerProfile.value.name || employerProfile.value.name === '-') {
        await loadEmployerProfile()
    }

    const data = employerProfile.value
    editProfile.value = {
        name: data.name || '-',
        industry: data.industry || '',
        location: data.location || '',
        website: data.website || '',
        about: data.about || ''
    }
}

function closeEditProfileOverlay() {
    const nextQuery = { ...route.query }
    delete nextQuery.panel
    router.replace({ query: nextQuery })
}

async function saveEditProfile() {
    const response = await fetch(`http://127.0.0.1:5000/api/employer/profile`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
            industry: editProfile.value.industry,
            location: editProfile.value.location,
            website: editProfile.value.website,
            about: editProfile.value.about
        })
    })

    const data = await response.json()
    if (!response.ok) {
        alert(data.message || 'Could not update profile.')
        return
    }

    alert(data.message || 'Profile updated successfully.')
    await loadEmployerProfile()
    closeEditProfileOverlay()
}

// CHANGE END: Employer Edit Profile Overlay
</script>

<!-- CHANGE START: Create Drive Overlay -->
<style scoped>
.overlay-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
}

.overlay-card {
    width: min(700px, 92vw);
    max-height: 88vh;
    overflow-y: auto;
}

/* CHANGE START: Employer Applications Overlay */
.overlay-card-wide {
    width: 100vw;
    height: 100vh;
}
/* CHANGE END: Employer Applications Overlay */

/* CHANGE START: Employer Application Details Overlay */
.overlay-backdrop-top {
    z-index: 1060;
}
/* CHANGE END: Employer Application Details Overlay */
</style>
<!-- CHANGE END: Create Drive Overlay -->
