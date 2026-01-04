function openJobModal() {
    document.getElementById('jobModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

let allJobs = [];
let currentUser = JSON.parse(localStorage.getItem("user"));

async function fetchJobs() {
    try {
        const res = await fetch('http://localhost:3000/api/jobs');
        allJobs = await res.json();
        displayJobs(allJobs);
    } catch (err) {
        console.error(err);
    }
}

function displayJobs(jobs) {
    const grid = document.getElementById('jobsGrid');

    if (!jobs || jobs.length === 0) {
        grid.innerHTML = '<p style="text-align:center; padding:20px;">No jobs found.</p>';
        return;
    }

    grid.innerHTML = jobs.map(j => `
        <div class="card">
            <div class="card-title">${j.title}</div>
            <div class="card-subtitle">${j.department} | ${j.location}</div>
            <p><strong>Vacancies:</strong> ${j.vacancies}</p>
            <p><strong>Deadline:</strong> ${new Date(j.deadline).toLocaleDateString()}</p>
            ${j.salary ? `<p><strong>Salary:</strong> ${j.salary}</p>` : ''}
            <div class="info-box"><strong>Education:</strong><br>${j.education}</div>
            ${j.experience ? `<div class="info-box"><strong>Experience:</strong><br>${j.experience}</div>` : ''}
            ${j.requirements ? `<div class="info-box"><strong>Requirements:</strong><br>${j.requirements}</div>` : ''}
        </div>
    `).join('');
}

function liveSearchJobs() {
    const query = document.getElementById("jobSearch").value.trim().toLowerCase();
    applySearchFilter(query);
}

function applySearchFilter(query) {
    if (query === "") {
        displayJobs(allJobs);
        return;
    }

    const filtered = allJobs.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query)
    );

    displayJobs(filtered);
}

function handleSearchKey(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const query = event.target.value.trim().toLowerCase();
        if (query !== "") {
            saveSearchHistory(query);
            applySearchFilter(query);
        }
    }
}

async function saveSearchHistory(searchTerm) {
    if (!currentUser) return;

    try {
        await fetch('http://localhost:3000/api/search-history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id,
                searchTerm,
                searchType: 'jobs'
            })
        });
    } catch (err) {
        console.error(err);
    }
}

async function loadSearchHistory() {
    if (!currentUser) return [];

    try {
        const res = await fetch(`http://localhost:3000/api/search-history/${currentUser.id}?type=jobs`);
        return await res.json();
    } catch (err) {
        console.error(err);
        return [];
    }
}

let historyTimeout;

async function showSearchHistory() {
    if (!currentUser) return;

    clearTimeout(historyTimeout);

    const dropdown = document.getElementById('searchHistoryDropdown');
    const list = document.getElementById('searchHistoryList');

    const history = await loadSearchHistory();

    if (history.length === 0) {
        list.innerHTML = '<div class="no-history">No recent searches</div>';
    } else {
        list.innerHTML = history.map(item => `
            <div class="history-item" onmousedown="useSearchHistory('${item.searchTerm}')">
                ${item.searchTerm}
            </div>
        `).join('');
    }

    dropdown.classList.add('active');
}

function hideSearchHistory() {
    historyTimeout = setTimeout(() => {
        document.getElementById('searchHistoryDropdown').classList.remove('active');
    }, 200);
}

function useSearchHistory(term) {
    document.getElementById('jobSearch').value = term;
    applySearchFilter(term.toLowerCase());
    document.getElementById('searchHistoryDropdown').classList.remove('active');
}

async function clearSearchHistory(event) {
    event.stopPropagation();

    if (!currentUser) return;

    try {
        await fetch(`http://localhost:3000/api/search-history/${currentUser.id}?type=jobs`, {
            method: 'DELETE'
        });
        document.getElementById('searchHistoryList').innerHTML =
            '<div class="no-history">No recent searches</div>';
    } catch (err) {
        console.error(err);
    }
}

fetchJobs();
