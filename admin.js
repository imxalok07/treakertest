
document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = this.querySelector('input[name="username"]').value;
    const password = this.querySelector('input[name="password"]').value;

    // Check hardcoded credentials
    if (username === 'AlokNegi' && password === 'Reset#12345') {
        // Redirect to dashboard on successful login
        window.location.href = 'admin-dashboard.html';
    } else {
        alert('Invalid credentials');
    }
});
