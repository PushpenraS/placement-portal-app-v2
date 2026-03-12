<template>
    <div class="card mt-2 mb-2 border-dark">
        <div class="card-header d-flex justify-content-between align-items-center">
            <div>
                <div class="fw-semibold">{{ candidateProfile.full_name }}</div>
                <small class="text-muted">{{ candidateProfile.qualification || 'No qualification added' }}</small>
            </div>
            <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-secondary" @click="openHistoryOverlay">History</button>
                <button class="btn btn-sm btn-outline-secondary" @click="openEditProfileOverlay">Edit Profile</button>
            </div>
        </div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-4">
                    <div class="p-2 border rounded bg-light">
                        <div class="small text-muted">Qualification</div>
                        <div>{{ candidateProfile.qualification || '-' }}</div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-2 border rounded bg-light">
                        <div class="small text-muted">Skills</div>
                        <div>{{ candidateProfile.skills || '-' }}</div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-2 border rounded bg-light">
                        <div class="small text-muted">Resume</div>
                        <div>
                            <a v-if="candidateProfile.resume_path" :href="candidateProfile.resume_path" target="_blank" rel="noopener noreferrer">
                                View Resume
                            </a>
                            <span v-else>-</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card mt-2 mb-2 border-dark">
        <div class="card-header d-flex justify-content-between align-items-center">
            <span>Organizations</span>
        </div>
        <div class="container-fluid pt-2">
            <table class="table table-bordered text-center align-middle">
                <thead>
                    <tr>
                        <th scope="col">Organization</th>
                        <th scope="col">Industry</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="employer in employers" :key="employer.employer_id">
                        <td>{{ employer.name }}</td>
                        <td>{{ employer.industry || '-' }}</td>
                        <td>
                            <button class="btn btn-outline-success btn-sm" @click="openEmployerOverlay(employer.employer_id)">View</button>
                        </td>
                    </tr>
                    <tr v-if="employers.length === 0">
                        <td colspan="3" class="text-muted">No organizations available.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="card mt-2 mb-2 border-dark">
        <div class="card-header">Applied Drives</div>
        <div class="container-fluid pt-2">
            <table class="table table-bordered text-center align-middle">
                <thead>
                    <tr>
                        <th scope="col">Application #</th>
                        <th scope="col">Drive Name</th>
                        <th scope="col">Organization</th>
                        <th scope="col">Applied At</th>
                        <th scope="col">Status</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="application in appliedDrives" :key="application.application_id">
                        <th scope="row">{{ application.application_id }}</th>
                        <td>{{ application.drive_name }}</td>
                        <td>{{ application.employer_name }}</td>
                        <td>{{ application.applied_at }}</td>
                        <td class="text-capitalize">{{ application.status }}</td>
                        <td>
                            <button class="btn btn-outline-success btn-sm"
                                @click="openAppliedDriveDetailsOverlay(application)">View</button>
                        </td>
                    </tr>
                    <tr v-if="appliedDrives.length === 0">
                        <td colspan="6">No applications submitted yet.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div v-if="showEmployerOverlay" class="overlay-backdrop" @click.self="closeEmployerOverlay">
        <div class="overlay-card card border-dark">
            <div class="card-header d-flex justify-content-between align-items-center">
                <div>
                    <span class="fw-semibold">{{ employerDetails.name }}</span>
                    <div class="small text-muted">{{ employerDetails.industry || '-' }} | {{ employerDetails.location || '-' }}</div>
                </div>
                <button class="btn btn-sm btn-outline-secondary" @click="closeEmployerOverlay">X</button>
            </div>

            <div class="card-body">
                <h5 class="mb-2">Overview</h5>
                <p class="mb-4">{{ employerDetails.about || '-' }}</p>

                <div class="row g-3 mb-4">
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Industry</div>
                            <div>{{ employerDetails.industry || '-' }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Website</div>
                            <div>
                                <a v-if="employerDetails.website" :href="employerDetails.website" target="_blank" rel="noopener noreferrer">
                                    {{ employerDetails.website }}
                                </a>
                                <span v-else>-</span>
                            </div>
                        </div>
                    </div>
                </div>

                <h5 class="mb-2">Current Drives</h5>
                <div class="table-responsive border rounded">
                    <table class="table table-bordered text-center align-middle mb-0">
                        <thead>
                            <tr>
                                <th scope="col">Drive</th>
                                <th scope="col">Job Title</th>
                                <th scope="col">Deadline</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="drive in employerDetails.current_drives" :key="drive.drive_id">
                                <td>{{ drive.name }}</td>
                                <td>{{ drive.job_title }}</td>
                                <td>{{ drive.application_deadline }}</td>
                                <td>
                                    <button v-if="!isDriveApplied(drive.drive_id)" class="btn btn-outline-primary btn-sm drive-action-btn"
                                        @click="openDriveOverlay(drive.drive_id)">View</button>
                                    <button v-else class="btn btn-outline-success btn-sm drive-action-btn" disabled>Applied</button>
                                </td>
                            </tr>
                            <tr v-if="employerDetails.current_drives.length === 0">
                                <td colspan="4">No active drives.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card-footer d-flex justify-content-end">
                <button class="btn btn-outline-secondary" @click="closeEmployerOverlay">Back</button>
            </div>
        </div>
    </div>

    <div v-if="showDriveOverlay" class="overlay-backdrop overlay-backdrop-top" @click.self="closeDriveOverlay">
        <div class="overlay-card card border-dark">
            <div class="card-header d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="mb-0">{{ driveDetails.name }}</h5>
                    <small class="text-muted">Drive #{{ driveDetails.drive_id }}</small>
                </div>
                <button class="btn btn-sm btn-outline-secondary" @click="closeDriveOverlay">X</button>
            </div>
            <div class="card-body">
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Job Title</div>
                            <div>{{ driveDetails.job_title }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Organization</div>
                            <div>{{ driveDetails.employer.name }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Salary</div>
                            <div>{{ driveDetails.salary }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Application Deadline</div>
                            <div>{{ driveDetails.application_deadline }}</div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Location</div>
                            <div>{{ driveDetails.location }}</div>
                        </div>
                    </div>
                </div>

                <h6 class="mb-2">Job Description</h6>
                <p class="mb-3">{{ driveDetails.job_description }}</p>

                <h6 class="mb-2">Eligibility Criteria</h6>
                <p class="mb-0">{{ driveDetails.eligibility_criteria }}</p>
            </div>
            <div class="card-footer d-flex justify-content-end gap-2">
                <div class="me-auto">
                    <span v-if="selectedDriveApplication.exists" class="text-success">
                        You have already applied to this drive.
                    </span>
                    <span v-else-if="driveDetails.status !== 'ongoing'" class="text-muted">
                        This drive is not open for applications.
                    </span>
                    <span v-else-if="!candidateProfile.resume_path" class="text-danger">
                        Add resume to apply.
                    </span>
                </div>
                <button v-if="!selectedDriveApplication.exists && driveDetails.status === 'ongoing' && candidateProfile.resume_path"
                    class="btn btn-outline-primary" @click="applyToDrive">Apply</button>
                <button v-else-if="!candidateProfile.resume_path" class="btn btn-outline-secondary" @click="openEditProfileOverlay">Edit Profile</button>
                <button class="btn btn-outline-secondary" @click="closeDriveOverlay">Back</button>
            </div>
        </div>
    </div>

    <div v-if="showAppliedDriveDetailsOverlay" class="overlay-backdrop overlay-backdrop-top" @click.self="closeAppliedDriveDetailsOverlay">
        <div class="overlay-card card border-dark">
            <div class="card-header d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="mb-0">{{ selectedAppliedDriveDetails.name }}</h5>
                    <small class="text-muted">Drive #{{ selectedAppliedDriveDetails.drive_id }}</small>
                </div>
                <button class="btn btn-sm btn-outline-secondary" @click="closeAppliedDriveDetailsOverlay">X</button>
            </div>
            <div class="card-body">
                <div class="row g-3 mb-3">
                    <div class="col-md-12">
                        <div class="p-2 border border-dark rounded bg-light">
                            <div class="small text-muted">Current Application Status</div>
                            <div class="text-capitalize">{{ selectedAppliedDriveDetails.current_application_status }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Job Title</div>
                            <div>{{ selectedAppliedDriveDetails.job_title }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Organization</div>
                            <div>{{ selectedAppliedDriveDetails.employer.name }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Salary</div>
                            <div>{{ selectedAppliedDriveDetails.salary }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Application Deadline</div>
                            <div>{{ selectedAppliedDriveDetails.application_deadline }}</div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Location</div>
                            <div>{{ selectedAppliedDriveDetails.location }}</div>
                        </div>
                    </div>
                </div>

                <h6 class="mb-2">Job Description</h6>
                <p class="mb-3">{{ selectedAppliedDriveDetails.job_description }}</p>

                <h6 class="mb-2">Eligibility Criteria</h6>
                <p class="mb-0">{{ selectedAppliedDriveDetails.eligibility_criteria }}</p>
            </div>
            <div class="card-footer d-flex justify-content-end">
                <button class="btn btn-outline-secondary" @click="closeAppliedDriveDetailsOverlay">Back</button>
            </div>
        </div>
    </div>

    <div v-if="showHistoryOverlay" class="overlay-backdrop overlay-backdrop-top" @click.self="closeHistoryOverlay">
        <div class="overlay-card overlay-card-wide card border-dark">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>Application History</span>
                <button class="btn btn-sm btn-outline-secondary" @click="closeHistoryOverlay">X</button>
            </div>
            <div class="card-body">
                <div class="small text-muted mb-2">
                    Candidate: {{ historyMeta.candidate_name }} | Department: {{ historyMeta.department }}
                </div>
                <table class="table table-bordered text-center align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Sr No</th>
                            <th scope="col">Drive #</th>
                            <th scope="col">Interview</th>
                            <th scope="col">Job Title</th>
                            <th scope="col">Result</th>
                            <th scope="col">Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in historyRows" :key="item.sr_no">
                            <th scope="row">{{ item.sr_no }}</th>
                            <td>{{ item.drive_no }}</td>
                            <td>{{ item.interview }}</td>
                            <td>{{ item.job_title }}</td>
                            <td>{{ item.result }}</td>
                            <td>{{ item.remark }}</td>
                        </tr>
                        <tr v-if="historyRows.length === 0">
                            <td colspan="6">No history available.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="card-footer d-flex justify-content-end">
                <button class="btn btn-outline-secondary" @click="closeHistoryOverlay">Back</button>
            </div>
        </div>
    </div>

    <div v-if="showEditProfileOverlay" class="overlay-backdrop overlay-backdrop-top" @click.self="closeEditProfileOverlay">
        <div class="overlay-card card border-dark">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>Edit Profile</span>
                <button class="btn btn-sm btn-outline-secondary" @click="closeEditProfileOverlay">X</button>
            </div>
            <div class="card-body">
                <div class="mb-2">
                    <label class="form-label">Candidate Name</label>
                    <input class="form-control" :value="editProfile.candidate_name" readonly>
                </div>
                <div class="mb-2">
                    <label class="form-label">Qualification</label>
                    <input class="form-control" v-model="editProfile.department">
                </div>
                <div class="mb-2">
                    <label class="form-label">Skills</label>
                    <textarea class="form-control" rows="3" v-model="editProfile.skills"></textarea>
                </div>
                <div class="mb-2">
                    <label class="form-label">Resume Path</label>
                    <input class="form-control" v-model="editProfile.resume_path">
                </div>
                <div v-if="editProfile.resume_path" class="mb-2">
                    <a :href="editProfile.resume_path" target="_blank" rel="noopener noreferrer">View Resume</a>
                </div>
            </div>
            <div class="card-footer d-flex justify-content-end gap-2">
                <button class="btn btn-outline-primary" @click="saveEditProfile">Save</button>
                <button class="btn btn-outline-secondary" @click="closeEditProfileOverlay">Back</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const candidateProfile = ref({
    candidate_id: '-',
    full_name: '-',
    qualification: '',
    skills: '',
    resume_path: ''
})
const employers = ref([])
const appliedDrives = ref([])
const historyMeta = ref({
    candidate_name: '-',
    department: '-'
})
const historyRows = ref([])
const showEmployerOverlay = ref(false)
const showDriveOverlay = ref(false)
const showAppliedDriveDetailsOverlay = ref(false)
const showHistoryOverlay = ref(false)
const showEditProfileOverlay = ref(false)
const driveAppliedLookup = ref({})
const selectedDriveApplication = ref({
    exists: false
})
const selectedAppliedDriveDetails = ref({
    drive_id: '-',
    name: '-',
    job_title: '-',
    job_description: '-',
    salary: '-',
    location: '-',
    eligibility_criteria: '-',
    application_deadline: '-',
    current_application_status: '-',
    employer: {
        employer_id: '-',
        name: '-'
    }
})
const editProfile = ref({
    candidate_name: '-',
    department: '-',
    skills: '',
    resume_path: ''
})
const employerDetails = ref({
    employer_id: '-',
    name: '-',
    about: '-',
    industry: '-',
    location: '-',
    website: '-',
    current_drives: []
})
const driveDetails = ref({
    drive_id: '-',
    name: '-',
    job_title: '-',
    job_description: '-',
    salary: '-',
    location: '-',
    eligibility_criteria: '-',
    application_deadline: '-',
    status: '-',
    employer: {
        employer_id: '-',
        name: '-'
    }
})

function authHeaders() {
    return {
        'content-type': 'application/json',
        'Authentication-Token': localStorage.getItem('auth_token') || ''
    }
}

onMounted(() => {
    refreshAll()
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
        getEmployers().then((rows) => {
            employers.value = rows || []
        }),
        loadCandidateProfile(),
        getAppliedDrives().then((rows) => {
            appliedDrives.value = rows || []
        }),
        getApplicationHistory().then((payload) => {
            historyMeta.value = {
                candidate_name: payload?.candidate_name || '-',
                department: payload?.department || '-'
            }
            historyRows.value = payload?.history || []
        })
    ])
}

async function loadCandidateProfile() {
    const response = await fetch(`http://127.0.0.1:5000/api/candidate/profile`, {
        method: 'GET',
        headers: authHeaders()
    })

    if (!response.ok) {
        return
    }

    const data = await response.json()
    candidateProfile.value = {
        candidate_id: data.candidate_id ?? '-',
        full_name: data.full_name || '-',
        qualification: data.qualification || '',
        skills: data.skills || '',
        resume_path: data.resume_path || ''
    }
    editProfile.value = {
        candidate_name: data.full_name || '-',
        department: data.qualification || '',
        skills: data.skills || '',
        resume_path: data.resume_path || ''
    }
}

async function getEmployers() {
    const response = await fetch('http://127.0.0.1:5000/api/candidate/employer', {
        method: 'GET',
        headers: authHeaders()
    })
    if (!response.ok) {
        return []
    }
    return await response.json()
}

async function getAppliedDrives() {
    const response = await fetch(`http://127.0.0.1:5000/api/candidate/application`, {
        method: 'GET',
        headers: authHeaders()
    })
    if (!response.ok) {
        return []
    }
    return await response.json()
}

async function getApplicationHistory() {
    const response = await fetch(`http://127.0.0.1:5000/api/candidate/history`, {
        method: 'GET',
        headers: authHeaders()
    })
    if (!response.ok) {
        return {
            candidate_name: '-',
            department: '-',
            history: []
        }
    }
    return await response.json()
}

async function openEmployerOverlay(employerId) {
    const response = await fetch(`http://127.0.0.1:5000/api/candidate/employer/${employerId}`, {
        method: 'GET',
        headers: authHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        alert(data.message || 'Could not retrieve employer details.')
        return
    }

    employerDetails.value = data
    await loadAppliedStatusForCurrentDrives()
    showEmployerOverlay.value = true
}

function closeEmployerOverlay() {
    showEmployerOverlay.value = false
    closeDriveOverlay()
    driveAppliedLookup.value = {}
    employerDetails.value = {
        employer_id: '-',
        name: '-',
        about: '-',
        industry: '-',
        location: '-',
        website: '-',
        current_drives: []
    }
}

function isDriveApplied(driveId) {
    return !!driveAppliedLookup.value[driveId]
}

async function loadAppliedStatusForCurrentDrives() {
    const drives = employerDetails.value.current_drives || []
    if (drives.length === 0) {
        driveAppliedLookup.value = {}
        return
    }

    const lookup = {}

    for (const drive of drives) {
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/api/candidate/drive/application/check/${drive.drive_id}`,
                {
                    method: 'GET',
                    headers: authHeaders()
                }
            )

            if (!response.ok) {
                lookup[drive.drive_id] = false
                continue
            }

            const payload = await response.json()
            lookup[drive.drive_id] = !!payload.exists
        } catch {
            lookup[drive.drive_id] = false
        }
    }

    driveAppliedLookup.value = lookup
}

async function openDriveOverlay(driveId) {
    const response = await fetch(`http://127.0.0.1:5000/api/candidate/drive/${driveId}`, {
        method: 'GET',
        headers: authHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        alert(data.message || 'Could not retrieve drive details.')
        return
    }

    driveDetails.value = data
    selectedDriveApplication.value = {
        exists: isDriveApplied(driveId)
    }
    showDriveOverlay.value = true
}

function closeDriveOverlay() {
    showDriveOverlay.value = false
    selectedDriveApplication.value = {
        exists: false
    }
    driveDetails.value = {
        drive_id: '-',
        name: '-',
        job_title: '-',
        job_description: '-',
        salary: '-',
        location: '-',
        eligibility_criteria: '-',
        application_deadline: '-',
        status: '-',
        employer: {
            employer_id: '-',
            name: '-'
        }
    }
}

async function applyToDrive() {
    if (!driveDetails.value.drive_id) {
        alert('Drive details missing.')
        return
    }

    const response = await fetch(`http://127.0.0.1:5000/api/candidate/drive/${driveDetails.value.drive_id}/apply`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({})
    })

    const data = await response.json()
    if (!response.ok) {
        alert(data.message || 'Could not apply to drive.')
        return
    }

    alert(data.message || 'Applied successfully.')
    driveAppliedLookup.value[driveDetails.value.drive_id] = true
    selectedDriveApplication.value.exists = true
    await refreshAll()
    closeDriveOverlay()
}

async function openAppliedDriveDetailsOverlay(application) {
    const response = await fetch(`http://127.0.0.1:5000/api/candidate/drive/${application.drive_id}`, {
        method: 'GET',
        headers: authHeaders()
    })

    if (!response.ok) {
        selectedAppliedDriveDetails.value.current_application_status = application.status
        showAppliedDriveDetailsOverlay.value = true
        return
    }

    const data = await response.json()
    selectedAppliedDriveDetails.value = {
        drive_id: data.drive_id,
        name: data.name,
        job_title: data.job_title,
        job_description: data.job_description,
        salary: data.salary,
        location: data.location,
        eligibility_criteria: data.eligibility_criteria,
        application_deadline: data.application_deadline,
        current_application_status: application.status,
        employer: {
            employer_id: data.employer?.employer_id ?? '-',
            name: data.employer?.name ?? '-'
        }
    }
    showAppliedDriveDetailsOverlay.value = true
}

function closeAppliedDriveDetailsOverlay() {
    showAppliedDriveDetailsOverlay.value = false
    selectedAppliedDriveDetails.value = {
        drive_id: '-',
        name: '-',
        job_title: '-',
        job_description: '-',
        salary: '-',
        location: '-',
        eligibility_criteria: '-',
        application_deadline: '-',
        current_application_status: '-',
        employer: {
            employer_id: '-',
            name: '-'
        }
    }
}

function syncOverlayFromQuery() {
    const panel = route.query.panel
    showHistoryOverlay.value = panel === 'history'
    showEditProfileOverlay.value = panel === 'edit_profile'
    if (showEditProfileOverlay.value) {
        loadCandidateProfileForEdit()
    }
}

function openHistoryOverlay() {
    router.replace({
        query: {
            ...route.query,
            panel: 'history'
        }
    })
}

function openEditProfileOverlay() {
    router.replace({
        query: {
            ...route.query,
            panel: 'edit_profile'
        }
    })
}

function closeHistoryOverlay() {
    const nextQuery = { ...route.query }
    delete nextQuery.panel
    router.replace({ query: nextQuery })
}

function closeEditProfileOverlay() {
    const nextQuery = { ...route.query }
    delete nextQuery.panel
    router.replace({ query: nextQuery })
}

async function loadCandidateProfileForEdit() {
    if (!candidateProfile.value.full_name || candidateProfile.value.full_name === '-') {
        await loadCandidateProfile()
    }
    const data = candidateProfile.value
    editProfile.value = {
        candidate_name: data.full_name || '-',
        department: data.qualification || '',
        skills: data.skills || '',
        resume_path: data.resume_path || ''
    }
}

async function saveEditProfile() {
    const response = await fetch(`http://127.0.0.1:5000/api/candidate/profile`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
            qualification: editProfile.value.department,
            skills: editProfile.value.skills,
            resume_path: editProfile.value.resume_path
        })
    })

    const data = await response.json()
    if (!response.ok) {
        alert(data.message || 'Could not update profile.')
        return
    }

    historyMeta.value.department = editProfile.value.department
    await loadCandidateProfile()
    alert(data.message || 'Profile updated successfully.')
    closeEditProfileOverlay()
}

</script>

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
    width: min(900px, 95vw);
    max-height: 90vh;
    overflow-y: auto;
}

.overlay-card-wide {
    width: min(1200px, 98vw);
}

.overlay-backdrop-top {
    z-index: 1060;
}

.drive-action-btn {
    min-width: 120px;
}
</style>
