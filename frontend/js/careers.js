// MODAL FUNCTIONS
function openCareerModal() { 
    document.getElementById('careerModal').classList.add('active'); 
}
function closeModal(modalId) { 
    document.getElementById(modalId).classList.remove('active'); 
}

// FETCH CAREERS
async function fetchCareers() {
    try {
        const res = await fetch('http://localhost:3000/api/careers');
        return await res.json();
    } catch(err) { 
        console.error("Error fetching careers:", err); 
    }
}

// DISPLAY CAREERS
async function displayCareersList() {
    const careers = await fetchCareers();
    displayCareers(careers);
}

function displayCareers(careerList) {
    const grid = document.getElementById('careerGrid');
    if (!careerList || careerList.length === 0) {
        grid.innerHTML = '<p>No career paths found.</p>';
        return;
    }
    grid.innerHTML = careerList.map(c => `
        <div class="card">
            <div class="card-title">${c.position}</div>
            <div class="card-subtitle">${c.department}</div>
            <div class="info-box"><strong>Education:</strong><br>${c.education}</div>
            <div class="info-box"><strong>Skills:</strong><br>${c.skills}</div>
            <div class="info-box"><strong>Career Path:</strong><br>${c.pathway}</div>
            ${c.exams ? `<div class="info-box"><strong>Exams/Certifications:</strong><br>${c.exams}</div>` : ''}
            <button class="btn btn-danger" onclick="deleteCareer('${c._id}')">Delete</button>
        </div>
    `).join('');
}

// ADD CAREER
async function addCareer(e) {
    e.preventDefault();
    const career = {
        position: document.getElementById('careerPosition').value,
        department: document.getElementById('careerDept').value,
        education: document.getElementById('careerEducation').value,
        skills: document.getElementById('careerSkills').value,
        pathway: document.getElementById('careerPath').value,
        exams: document.getElementById('careerExams').value
    };
    try {
        await fetch('http://localhost:3000/api/careers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(career)
        });
        closeModal('careerModal');
        document.getElementById('careerForm').reset();
        displayCareersList();
    } catch(err) { 
        console.error("Error adding career:", err); 
    }
}

// DELETE CAREER
async function deleteCareer(id) {
    if (!confirm("Delete this career path?")) return;
    try {
        await fetch(`http://localhost:3000/api/careers/${id}`, { method: 'DELETE' });
        displayCareersList();
    } catch(err) { 
        console.error("Error deleting career:", err); 
    }
}

// SEARCH CAREERS
function searchCareers() {
    const term = document.getElementById('careerSearch').value.toLowerCase();
    fetchCareers().then(careers => {
        const filtered = careers.filter(c => 
            c.position.toLowerCase().includes(term) || 
            c.department.toLowerCase().includes(term) || 
            c.skills.toLowerCase().includes(term)
        );
        displayCareers(filtered);
    });
}

// INIT
displayCareersList();
