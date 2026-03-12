<template>
    <div class="row g-3 mt-2 mb-2">
        <div class="col-md-6 col-xl-3">
            <div class="card text-bg-dark h-100">
                <div class="card-body">
                    <h2 class="h6 card-title">Approved Employers</h2>
                    <p class="display-6 mb-0">{{ approvedEmployers.length }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-xl-3">
            <div class="card text-bg-secondary h-100">
                <div class="card-body">
                    <h2 class="h6 card-title">Pending Approvals</h2>
                    <p class="display-6 mb-0">{{ pendingEmployers.length + pendingDrives.length }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-xl-3">
            <div class="card text-bg-light h-100">
                <div class="card-body">
                    <h2 class="h6 card-title">Candidates</h2>
                    <p class="display-6 mb-0">{{ registeredCandidates.length }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-xl-3">
            <div class="card border-dark h-100">
                <div class="card-body">
                    <h2 class="h6 card-title">Ongoing Drives</h2>
                    <p class="display-6 mb-0">{{ ongoingDrives.length }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="card mt-2 mb-2 border-dark">
        <div class="card-header">
            Search Dashboard
        </div>
        <div class="card-body">
            <div class="row g-2">
                <div class="col-md-3">
                    <select class="form-select" v-model="searchScope">
                        <option value="all">All</option>
                        <option value="candidate">Candidate</option>
                        <option value="employer">Employer</option>
                    </select>
                </div>
                <div class="col-md-9">
                    <div class="d-flex gap-2">
                        <input
                            v-model.trim="searchQuery"
                            type="search"
                            class="form-control"
                            placeholder="Search dashboard"
                        >
                        <button
                            type="button"
                            class="btn btn-outline-secondary"
                            :disabled="!searchQuery && searchScope === 'all'"
                            @click="clearSearch"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card mt-2 mb-2 border-dark">
        <div class="card-header">
            Registered Employers
        </div>
        <div>
            <ul class="list-group list-group-flush mt-2 mb-2">
                <Employer
                v-for="employer in approvedEmployers"
                :key="employer.employer_id"
                :employer="employer"
                @refresh-employers="handleRefreshEmployers"/>
                <li v-if="approvedEmployers.length === 0" class="list-group-item text-muted">
                    No approved employers available.
                </li>
            </ul>
        </div>
    </div>

    <div class="card mt-2 mb-2 border-dark">
        <div class="card-header">
            Registered Candidates
        </div>
        <div>
            <ul class="list-group list-group-flush mt-2 mb-2">
                <Candidate
                v-for="candidate in registeredCandidates"
                :key="candidate.candidate_id"
                :candidate="candidate"
                @refresh-candidates="handleRefreshCandidates"/>
                <li v-if="registeredCandidates.length === 0" class="list-group-item text-muted">
                    No registered candidates available.
                </li>
            </ul>
        </div>
    </div>

    <div class="card mt-2 mb-2 border-dark">
        <div class="card-header">
            Pending Approvals
        </div>
        <div>
            <ul class="list-group list-group-flush mt-2 mb-2">
                <Employer v-for="employer in pendingEmployers"
                :key="employer.employer_id"
                :employer="employer"
                @refresh-employers="handleRefreshEmployers"/>
                <li v-if="pendingEmployers.length === 0" class="list-group-item text-muted">
                    No pending approvals.
                </li>
            </ul>
        </div>
    </div>

    <div class="card mt-2 mb-2 border-dark">
        <div class="card-header">
            Pending Drive Approvals
        </div>
        <div class="container-fluid pt-2">
            <table class="table table-bordered text-center align-middle">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Drive Name</th>
                        <th scope="col">Employer</th>
                        <th scope="col">Deadline</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="drive in pendingDrives" :key="drive.drive_id">
                        <th scope="row">{{ drive.drive_id }}</th>
                        <td>{{ drive.name }}</td>
                        <td>{{ drive.employer_name || '-' }}</td>
                        <td>{{ drive.application_deadline || '-' }}</td>
                        <td>
                            <div class="d-flex justify-content-center gap-2 flex-wrap">
                                <button class="btn btn-outline-secondary btn-sm" @click="openDriveDetailsOverlay(drive.drive_id)">View Details</button>
                                <button class="btn btn-outline-success btn-sm" @click="updateDriveStatus(drive.drive_id, 'approve')">Approve</button>
                                <button class="btn btn-outline-danger btn-sm" @click="updateDriveStatus(drive.drive_id, 'reject')">Reject</button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="pendingDrives.length === 0">
                        <td colspan="5" class="text-muted">No pending drive approvals.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="card mt-2 mb-2 border-dark">
        <div class="card-header">
            Ongoing Drives
        </div>
        <div class="container-fluid pt-2">
            <table class="table table-bordered text-center align-middle">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Drive Name</th>
                        <th scope="col">Employer</th>
                        <th scope="col">Deadline</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="drive in ongoingDrives" :key="drive.drive_id">
                        <th scope="row">{{ drive.drive_id }}</th>
                        <td>{{ drive.name }}</td>
                        <td>{{ drive.employer_name || '-' }}</td>
                        <td>{{ drive.application_deadline || '-' }}</td>
                        <td>
                            <div class="d-flex justify-content-center gap-2 flex-wrap">
                                <button class="btn btn-outline-secondary btn-sm" @click="openDriveDetailsOverlay(drive.drive_id)">View Details</button>
                                <button class="btn btn-outline-dark btn-sm" @click="updateDriveStatus(drive.drive_id, 'mark_complete')">Mark as Complete</button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="ongoingDrives.length === 0">
                        <td colspan="5" class="text-muted">No ongoing drives available.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="card mt-2 mb-2 border-dark">
        <div class="card-header">
            Candidate Applications
        </div>
        <div class="container-fluid pt-2">
            <table class="table table-bordered text-center align-middle">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Candidate Name</th>
                        <th scope="col">Drive Name</th>
                        <th scope="col">Employer Name</th>
                        <th scope="col">Applied Date</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <Application
                    v-for="application in candidateApplications"
                    :key="application.application_id"
                    :application="application"
                    @view-application-details="openApplicationDetailsOverlay">
                    </Application>
                    <tr v-if="candidateApplications.length === 0">
                        <td colspan="6" class="text-muted">No candidate applications available.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div v-if="showDriveDetailsOverlay" class="overlay-backdrop" @click.self="closeDriveDetailsOverlay">
        <div class="overlay-card card border-dark">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>Drive Details</span>
                <button class="btn btn-sm btn-outline-secondary" @click="closeDriveDetailsOverlay">X</button>
            </div>
            <div class="card-body">
                <h6 class="mb-3">Drive Information</h6>
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Drive ID</div>
                            <div>{{ driveDetails.drive_id }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Status</div>
                            <div class="text-capitalize">{{ driveDetails.status }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Drive Name</div>
                            <div>{{ driveDetails.name }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Job Title</div>
                            <div>{{ driveDetails.job_title }}</div>
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
                            <div class="small text-muted">Location</div>
                            <div>{{ driveDetails.location }}</div>
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
                            <div class="small text-muted">Job Description</div>
                            <div>{{ driveDetails.job_description }}</div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Eligibility Criteria</div>
                            <div>{{ driveDetails.eligibility_criteria }}</div>
                        </div>
                    </div>
                </div>

                <hr class="my-4">

                <h6 class="mb-3">Employer Information</h6>
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Organization</div>
                            <div>{{ driveDetails.employer_name }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Employer Email</div>
                            <div>{{ driveDetails.employer_email }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Industry</div>
                            <div>{{ driveDetails.employer_industry }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Employer Location</div>
                            <div>{{ driveDetails.employer_location }}</div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Website</div>
                            <div>{{ driveDetails.employer_website }}</div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">About Employer</div>
                            <div>{{ driveDetails.employer_about }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer d-flex justify-content-end">
                <button class="btn btn-outline-secondary" @click="closeDriveDetailsOverlay">Back</button>
            </div>
        </div>
    </div>

    <div v-if="showApplicationDetailsOverlay" class="overlay-backdrop" @click.self="closeApplicationDetailsOverlay">
        <div class="overlay-card card border-dark">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>Application Details</span>
                <button class="btn btn-sm btn-outline-secondary" @click="closeApplicationDetailsOverlay">X</button>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Application ID</div>
                            <div>{{ applicationDetails.application_id }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Status</div>
                            <div class="text-capitalize">{{ applicationDetails.status }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Candidate Name</div>
                            <div>{{ applicationDetails.candidate.full_name }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Qualification</div>
                            <div>{{ applicationDetails.candidate.qualification }}</div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Skills</div>
                            <div>{{ applicationDetails.candidate.skills }}</div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Resume Path</div>
                            <div>{{ applicationDetails.candidate.resume_path }}</div>
                        </div>
                    </div>
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
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Job Title</div>
                            <div>{{ applicationDetails.drive.job_title }}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Organization</div>
                            <div>{{ applicationDetails.drive.employer_name }}</div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="p-2 border rounded bg-light">
                            <div class="small text-muted">Applied At</div>
                            <div>{{ applicationDetails.applied_at }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer d-flex justify-content-end">
                <button class="btn btn-outline-secondary" @click="closeApplicationDetailsOverlay">Back</button>
            </div>
        </div>
    </div>

</template>
<script setup>

import { computed, ref, onMounted } from 'vue';
import Employer from '@/components/Employer.vue';
import Candidate from '@/components/Candidate.vue';
import Application from '@/components/Application.vue';

const approved_employers = ref([])
const pending_employers = ref([])
const registered_candidates = ref([])
const pending_drives = ref([])
const ongoing_drives = ref([])
const candidate_applications = ref([])
const searchQuery = ref('')
const searchScope = ref('all')
const showDriveDetailsOverlay = ref(false)
const showApplicationDetailsOverlay = ref(false)
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
    employer_id: '-',
    employer_name: '-',
    employer_email: '-',
    employer_industry: '-',
    employer_location: '-',
    employer_website: '-',
    employer_about: '-'
})
const applicationDetails = ref({
    application_id: '-',
    status: '-',
    applied_at: '-',
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
        employer_name: '-'
    }
})

function includesValue(value, query) {
    return String(value || '').toLowerCase().includes(query)
}

function clearSearch() {
    searchQuery.value = ''
    searchScope.value = 'all'
}

const approvedEmployers = computed(() => {
    const query = searchQuery.value.toLowerCase()
    if (!query) {
        return approved_employers.value
    }
    if (!['all', 'employer'].includes(searchScope.value)) {
        return []
    }
    return approved_employers.value.filter((employer) =>
        includesValue(employer.name, query) ||
        includesValue(employer.email, query) ||
        includesValue(employer.industry, query) ||
        includesValue(employer.employer_id, query)
    )
})

const pendingEmployers = computed(() => {
    const query = searchQuery.value.toLowerCase()
    if (!query) {
        return pending_employers.value
    }
    if (!['all', 'employer'].includes(searchScope.value)) {
        return []
    }
    return pending_employers.value.filter((employer) =>
        includesValue(employer.name, query) ||
        includesValue(employer.email, query) ||
        includesValue(employer.industry, query) ||
        includesValue(employer.employer_id, query)
    )
})

const registeredCandidates = computed(() => {
    const query = searchQuery.value.toLowerCase()
    if (!query) {
        return registered_candidates.value
    }
    if (!['all', 'candidate'].includes(searchScope.value)) {
        return []
    }
    return registered_candidates.value.filter((candidate) =>
        includesValue(candidate.full_name, query) ||
        includesValue(candidate.email, query) ||
        includesValue(candidate.candidate_id, query)
    )
})

const pendingDrives = computed(() => {
    const query = searchQuery.value.toLowerCase()
    if (!query) {
        return pending_drives.value
    }
    if (!['all', 'employer'].includes(searchScope.value)) {
        return []
    }
    return pending_drives.value.filter((drive) =>
        includesValue(drive.name, query) ||
        includesValue(drive.employer_name, query) ||
        includesValue(drive.employer_email, query) ||
        includesValue(drive.drive_id, query)
    )
})

const ongoingDrives = computed(() => {
    const query = searchQuery.value.toLowerCase()
    if (!query) {
        return ongoing_drives.value
    }
    if (!['all', 'employer'].includes(searchScope.value)) {
        return []
    }
    return ongoing_drives.value.filter((drive) =>
        includesValue(drive.name, query) ||
        includesValue(drive.employer_name, query) ||
        includesValue(drive.employer_email, query) ||
        includesValue(drive.drive_id, query)
    )
})

const candidateApplications = computed(() => {
    const query = searchQuery.value.toLowerCase()
    if (!query) {
        return candidate_applications.value
    }

    if (searchScope.value === 'candidate') {
        return candidate_applications.value.filter((application) =>
            includesValue(application.candidate_name, query) ||
            includesValue(application.candidate_email, query)
        )
    }

    if (searchScope.value === 'employer') {
        return candidate_applications.value.filter((application) =>
            includesValue(application.drive_name, query) ||
            includesValue(application.employer_name, query) ||
            includesValue(application.employer_email, query)
        )
    }

    return candidate_applications.value.filter((application) =>
        includesValue(application.candidate_name, query) ||
        includesValue(application.candidate_email, query) ||
        includesValue(application.drive_name, query) ||
        includesValue(application.employer_name, query) ||
        includesValue(application.employer_email, query)
    )
})

function authHeaders() {
    return {
        'content-type': 'application/json',
        'Authentication-Token': localStorage.getItem('auth_token') || ''
    }
}


onMounted(() => {
    getEmployers(true).then(ae => approved_employers.value = ae || [])
    getEmployers(false).then(pe => pending_employers.value = pe || [])
    getCandidates().then(c => registered_candidates.value = c || [])
    getPlacementDrives('pending').then(pd => pending_drives.value = pd || [])
    getPlacementDrives('ongoing').then(od => ongoing_drives.value = od || [])
    getCandidateApplications().then(ca => candidate_applications.value = ca || [])
})

async function getEmployers(approved_status) {
    let response = null
    if (approved_status) {
        response = await fetch("http://127.0.0.1:5000/api/admin/employer", {
            method: 'GET',
            headers: authHeaders()
        })
    } else {
        response = await fetch("http://127.0.0.1:5000/api/admin/employer/pending", {
            method: 'GET',
            headers: authHeaders()
        })
    }

    if (response.ok) {
        const data = await response.json()
        console.log(data)
        return data;
    } else {
        return null
    }
}

async function getCandidates() {
    let response = await fetch("http://127.0.0.1:5000/api/admin/candidate", {
            method: 'GET',
            headers: authHeaders()
        })
    if (response.ok) {
        const data = await response.json()
        console.log(data)
        return data;
    } else {
        return null
    }
}

async function getPlacementDrives(status = 'ongoing') {
    let response = await fetch(`http://127.0.0.1:5000/api/admin/drive?status=${status}`, {
            method: 'GET',
            headers: authHeaders()
        })
    if (response.ok) {
        const data = await response.json()
        console.log(data)
        return data;
    } else {
        return null
    }
}

async function getCandidateApplications() {
    let response = await fetch("http://127.0.0.1:5000/api/admin/candidate/application", {
            method: 'GET',
            headers: authHeaders()
        })
    if (response.ok) {
        const data = await response.json()
        console.log(data)
        return data;
    } else {
        return null
    }
}

async function handleRefreshEmployers({ action }) {
  if (action === 'approve') {
    approved_employers.value = await getEmployers(true) || []
    pending_employers.value = await getEmployers(false) || []
    return
  }

  // activate/deactivate only changes approved list
  approved_employers.value = await getEmployers(true) || []
}

async function handleRefreshCandidates() {
  registered_candidates.value = await getCandidates() || []
}

async function handleRefreshDrives() {
  pending_drives.value = await getPlacementDrives('pending') || []
  ongoing_drives.value = await getPlacementDrives('ongoing') || []
}

async function updateDriveStatus(driveId, action) {
    const response = await fetch(`http://127.0.0.1:5000/api/admin/drive/${driveId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ action })
    })

    const data = await response.json()
    if (!response.ok) {
        alert(data.message || 'Could not update drive.')
        return
    }

    await handleRefreshDrives()
}

async function openDriveDetailsOverlay(driveId) {
    const response = await fetch(`http://127.0.0.1:5000/api/admin/drive/${driveId}`, {
        method: 'GET',
        headers: authHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        alert(data.message || 'Could not retrieve drive details.')
        return
    }

    driveDetails.value = data
    showDriveDetailsOverlay.value = true
}

function closeDriveDetailsOverlay() {
    showDriveDetailsOverlay.value = false
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
        employer_id: '-',
        employer_name: '-',
        employer_email: '-',
        employer_industry: '-',
        employer_location: '-',
        employer_website: '-',
        employer_about: '-'
    }
}

async function openApplicationDetailsOverlay(applicationId) {
    const response = await fetch(`http://127.0.0.1:5000/api/admin/candidate/application/${applicationId}`, {
        method: 'GET',
        headers: authHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        alert(data.message || 'Could not retrieve application details.')
        return
    }

    applicationDetails.value = data
    showApplicationDetailsOverlay.value = true
}

function closeApplicationDetailsOverlay() {
    showApplicationDetailsOverlay.value = false
    applicationDetails.value = {
        application_id: '-',
        status: '-',
        applied_at: '-',
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
            employer_name: '-'
        }
    }
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
</style>
