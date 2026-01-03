// MODAL
function openJobModal() { document.getElementById('jobModal').classList.add('active'); }
function closeModal(modalId) { document.getElementById(modalId).classList.remove('active'); }

let allJobs = []; // Store all jobs for filtering

// FETCH
async function fetchJobs() {
    try {
        const res = await fetch('http://localhost:3000/api/jobs');
        allJobs = await res.json(); // Store in global variable
        displayJobs(allJobs);
        return allJobs;
    } catch(err) { 
        console.error('Error fetching jobs:', err);
        return [];
    }
}

// DISPLAY (without delete button)
function displayJobs(jobs) {
    const grid = document.getElementById('jobsGrid');
    if(jobs.length === 0) { 
        grid.innerHTML = '<p style="color:white; text-align:center; padding:20px;">No jobs found matching your search.</p>'; 
        return; 
    }
    grid.innerHTML = jobs.map(j => `
        <div class="card">
            <div class="card-title">${j.title}</div>
            <div class="card-subtitle">${j.department} | ${j.location}</div>
            <p><strong>📊 Vacancies:</strong> ${j.vacancies}</p>
            <p><strong>⏰ Deadline:</strong> ${new Date(j.deadline).toLocaleDateString()}</p>
            ${j.salary ? `<p><strong>💰 Salary:</strong> ${j.salary}</p>` : ''}
            <div class="info-box"><strong>🎓 Education:</strong><br>${j.education}</div>
            ${j.experience ? `<div class="info-box"><strong>💼 Experience:</strong><br>${j.experience}</div>` : ''}
            ${j.requirements ? `<div class="info-box"><strong>📋 Requirements:</strong><br>${j.requirements}</div>` : ''}
        </div>
    `).join('');
}

// LIVE SEARCH - filters as user types
function liveSearchJobs() {
    const term = document.getElementById('jobSearch').value.toLowerCase().trim();
    
    // If search is empty, show all jobs
    if (!term) {
        displayJobs(allJobs);
        return;
    }
    
    // Filter jobs based on search term
    const filtered = allJobs.filter(j => 
        j.title.toLowerCase().includes(term) ||
        j.department.toLowerCase().includes(term) ||
        j.location.toLowerCase().includes(term)
    );
    
    displayJobs(filtered);
}

// INIT
fetchJobs();