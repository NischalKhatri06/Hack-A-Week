function openComplaintModal() { document.getElementById('complaintModal').classList.add('active'); }
function closeModal(modalId) { document.getElementById(modalId).classList.remove('active'); }

async function fetchComplaints() {
    try {
        const res = await fetch("http://localhost:3000/api/complaints");
        return await res.json();
    } catch(err){ 
        console.error('Error fetching complaints:', err);
        return [];
    }
}

async function displayComplaintsList() {
    const complaints = await fetchComplaints();
    displayComplaints(complaints);
}

const CURRENT_USER_ID = '64f000000000000000000001'; // replace dynamically after login
function displayComplaints(complaintList) {
    const grid = document.getElementById('complaintsGrid');
    if(!complaintList || complaintList.length===0) { 
        grid.innerHTML = '<p style="color:white; text-align:center; padding:20px;">No complaints found.</p>'; 
        return; 
    }

    grid.innerHTML = complaintList.map(c => `
        <div class="card" style="${c.userId.toString() === CURRENT_USER_ID ? 'border: 2px solid #667eea;' : ''}">
            <div class="card-title">${c.subject}</div>
            <div class="card-subtitle">${c.department}</div>
            <span class="badge badge-${c.priority}">${c.priority.toUpperCase()}</span>
            <span class="badge badge-${c.status}">${c.status.toUpperCase()}</span>
            <div style="margin:15px 0;color:#555;">
                <p><strong> Name:</strong> ${c.name}</p>
                <p><strong> Phone:</strong> ${c.phone}</p>
                ${c.email ? `<p><strong> Email:</strong> ${c.email}</p>` : ''}
                ${c.location ? `<p><strong>Location:</strong> ${c.location}</p>` : ''}
                <p><strong>Submitted:</strong> ${new Date(c.date).toLocaleString()}</p>
            </div>
            <div class="info-box"><strong>Description:</strong><br>${c.description}</div>
            <div style="margin-top:15px; display:flex; gap:10px; align-items:center;">
                <select onchange="updateComplaintStatus('${c._id}', this.value)" style="flex:1;">
                    <option value="pending" ${c.status==='pending'?'selected':''}>Pending</option>
                    <option value="in-progress" ${c.status==='in-progress'?'selected':''}>In Progress</option>
                    <option value="resolved" ${c.status==='resolved'?'selected':''}>Resolved</option>
                </select>
                ${c.userId.toString() === CURRENT_USER_ID ? `<button class="btn btn-danger" onclick="deleteComplaint('${c._id}')">Delete</button>` : ''}
            </div>
        </div>
    `).join('');
}




async function addComplaint(e) {
    e.preventDefault();
    const complaint = {
        name: document.getElementById('complainantName').value,
        phone: document.getElementById('complainantPhone').value,
        email: document.getElementById('complainantEmail').value,
        department: document.getElementById('complaintDept').value,
        priority: document.getElementById('complaintPriority').value,
        subject: document.getElementById('complaintSubject').value,
        description: document.getElementById('complaintDesc').value,
        location: document.getElementById('complaintLocation').value,
    };
    
    try {
        const res = await fetch("http://localhost:3000/api/complaints", {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify(complaint)
        });
        
        if (res.ok) {
            closeModal('complaintModal');
            document.getElementById('complaintForm').reset();
            displayComplaintsList();
            alert("Complaint submitted successfully!");
        } else {
            const error = await res.json();
            alert('Error: ' + (error.message || 'Failed to submit complaint'));
        }
    } catch(err){ 
        console.error('Error adding complaint:', err);
        alert('Server error. Please check if backend is running.');
    }
}

async function deleteComplaint(id) {
    if (!confirm("Are you sure you want to delete this complaint?")) return;

    try {
        const res = await fetch(`http://localhost:3000/api/complaints/${id}`, {
            method: 'DELETE'
        });

        const data = await res.json();

        if (res.ok) {
            displayComplaintsList();
            alert(data.message);
        } else {
            alert(data.error);  // show backend error (e.g., not your complaint)
        }
    } catch (err) {
        console.error('Error deleting complaint:', err);
        alert('Failed to delete complaint');
    }
}


async function updateComplaintStatus(id, status){
    try {
        await fetch(`http://localhost:3000/api/complaints/${id}/status`, {
            method:'PUT',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({status})
        });
        displayComplaintsList();
    } catch(err) {
        console.error('Error updating status:', err);
        alert('Failed to update status');
    }
}

function filterComplaints() {
    const priority = document.getElementById('priorityFilter').value;
    const status = document.getElementById('statusFilter').value;
    
    fetchComplaints().then(complaints => {
        let filtered = complaints;
        
        if (priority) {
            filtered = filtered.filter(c => c.priority === priority);
        }
        
        if (status) {
            filtered = filtered.filter(c => c.status === status);
        }
        
        displayComplaints(filtered);
    });
}

displayComplaintsList();