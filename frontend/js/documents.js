function openDocModal(){ document.getElementById('docModal').classList.add('active'); }
function closeModal(modalId){ document.getElementById(modalId).classList.remove('active'); }

async function fetchDocuments(){
    try{
        const res = await fetch('http://localhost:3000/api/documents');
        return await res.json();
    }catch(err){ console.error(err); }
}

async function displayDocumentsList(){
    const documents = await fetchDocuments();
    displayDocuments(documents);
}

function displayDocuments(docList){
    const grid = document.getElementById('documentsGrid');
    if(!docList || docList.length===0){ grid.innerHTML='<p>No document guides found.</p>'; return; }
    grid.innerHTML = docList.map(d=>`
        <div class="document-item">
            <div class="doc-title">${d.service}</div>
            <p style="color:#764ba2;font-weight:600;">📍 ${d.office}</p>
            <div style="background:#f7fafc;padding:15px;border-radius:8px;">
                <strong>📋 Required Documents:</strong>
                <ul>${d.documents.map(doc=>`<li>${doc}</li>`).join('')}</ul>
            </div>
            ${d.info?`<div class="info-box"><strong>ℹ️ Info:</strong><br>${d.info}</div>`:''}
            <button class="btn btn-danger" onclick="deleteDocument('${d._id}')">Delete</button>
        </div>
    `).join('');
}

async function addDocument(e){
    e.preventDefault();
    const doc={
        service: document.getElementById('serviceName').value,
        office: document.getElementById('serviceOffice').value,
        documents: document.getElementById('serviceDocuments').value.split('\n').map(d=>d.trim()).filter(Boolean),
        info: document.getElementById('serviceInfo').value
    };
    try{
        await fetch('http://localhost:3000/api/documents',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(doc)
        });
        closeModal('docModal');
        document.getElementById('docForm').reset();
        displayDocumentsList();
    }catch(err){ console.error(err); }
}

async function deleteDocument(id){
    if(!confirm("Delete this document guide?")) return;
    await fetch(`http://localhost:3000/api/documents/${id}`, { method:'DELETE' });
    displayDocumentsList();
}

function searchDocuments(){
    const term = document.getElementById('docSearch').value.toLowerCase();
    fetchDocuments().then(docs=>{
        const filtered = docs.filter(d=> d.service.toLowerCase().includes(term) || d.office.toLowerCase().includes(term));
        displayDocuments(filtered);
    });
}

// INIT
displayDocumentsList();
