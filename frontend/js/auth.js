const container = document.getElementById("accountContainer");
let currentUser = JSON.parse(localStorage.getItem("user"));

// SHOW LOGIN OR PROFILE
if (!currentUser) {
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <h2>Welcome!</h2>
                <p>Do you have an account?</p>
                <div style="display:flex; justify-content:center; gap:20px; flex-wrap:wrap;">
                    <button class="btn btn-success" onclick="showLogin()">Login</button>
                    <button class="btn btn-warning" onclick="showSignup()">Sign Up</button>
                </div>
            </div>
        </div>
    `;
} else {
    showProfile(currentUser);
}

// LOGIN FORM
function showLogin() {
    container.innerHTML = `
        <div class="card">
            <h2 style="color:#667eea; margin-bottom:15px;">Login</h2>
            <form onsubmit="login(event)">
                <div class="form-group">
                    <label for="loginEmail">Email</label>
                    <input type="email" id="loginEmail" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label for="loginPassword">Password</label>
                    <input type="password" id="loginPassword" placeholder="Enter your password" required>
                </div>
                <button class="btn btn-success">Login</button>
                <p style="margin-top:15px;">Don't have an account? <span style="color:#667eea; cursor:pointer;" onclick="showSignup()">Sign Up</span></p>
            </form>
        </div>
    `;
}

// SIGNUP FORM
function showSignup() {
    container.innerHTML = `
        <div class="card">
            <h2 style="color:#667eea; margin-bottom:15px;">Sign Up</h2>
            <form onsubmit="signup(event)">
                <div class="form-group">
                    <label for="signupName">Name</label>
                    <input type="text" id="signupName" placeholder="Enter your full name" required>
                </div>
                <div class="form-group">
                    <label for="signupEmail">Email</label>
                    <input type="email" id="signupEmail" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label for="signupPassword">Password</label>
                    <input type="password" id="signupPassword" placeholder="Enter a password" required>
                </div>
                <button class="btn btn-warning">Sign Up</button>
                <p style="margin-top:15px;">Already have an account? <span style="color:#667eea; cursor:pointer;" onclick="showLogin()">Login</span></p>
            </form>
        </div>
    `;
}

// SIGNUP FUNCTION
async function signup(e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const res = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.message);
            showLogin();
        } else {
            alert(data.message || 'Signup failed');
        }
    } catch (err) {
        console.error('Signup error:', err);
        alert('Server error. Please check if the backend is running.');
    }
}

// LOGIN FUNCTION
async function login(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const res = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
            alert(data.message || 'Login failed');
            return;
        }

        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "account.html";
    } catch (err) {
        console.error('Login error:', err);
        alert("Server error. Please check if the backend is running.");
    }
}

// PROFILE
function showProfile(user) {
    container.innerHTML = `
        <div class="card">
            <h2 style="color:#667eea; margin-bottom:15px;">👤 User Profile</h2>
            <div class="info-box"><strong>Name:</strong> ${user.name}</div>
            <div class="info-box" style="margin-top:10px;"><strong>Email:</strong> ${user.email}</div>
            <div class="info-box" style="margin-top:10px;"><strong>Role:</strong> ${user.role || 'citizen'}</div>
            <button class="btn btn-danger" style="margin-top:20px;" onclick="logout()">Logout</button>
        </div>
    `;
}

// LOGOUT
function logout() {
    localStorage.removeItem("user");
    window.location.href = "account.html";
}