// DOM Elements
const trailsForm = document.getElementById('addTrailForm');
const trailsTable = document.getElementById('trails-table');
const trailsTableBody = document.getElementById('trails-table-body'); // Added table body element


// Helper Functions
function showAlert(message, type = 'success') {
    alert(message); // Simple alert for now
}

async function handleTrailSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
        const response = await fetch('/api/trails', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Failed to save trail');

        const result = await response.json();
        showAlert('Trail saved successfully');
        loadTrails();
        hideTrailForm();
        e.target.reset();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function loadTrails() {
    try {
        const response = await fetch('/api/trails');
        const trails = await response.json();

        trailsTableBody.innerHTML = '';
        trails.forEach(trail => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Name">${trail.name}</td>
                <td data-label="Difficulty">${trail.difficulty.charAt(0).toUpperCase() + trail.difficulty.slice(1)}</td>
                <td data-label="Duration">${trail.duration} days</td>
                <td data-label="Season">${trail.season}</td>
                <td data-label="Altitude">${trail.altitude} m</td>
                <td data-label="Actions">
                    <button class="action-btn edit-btn" onclick="editTrail(${trail.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteTrail(${trail.id})">Delete</button>
                </td>
            `;
            trailsTableBody.appendChild(row);
        });
    } catch (error) {
        showAlert('Error loading trails', 'error');
    }
}

async function deleteTrail(id) {
    if (!confirm('Are you sure you want to delete this trail?')) return;

    try {
        const response = await fetch(`/api/trails/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete trail');

        showAlert('Trail deleted successfully');
        loadTrails();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function editTrail(id) {
    try {
        const response = await fetch(`/api/trails/${id}`);
        const trail = await response.json();

        const form = document.getElementById('addTrailForm');
        form.trailName.value = trail.name;
        form.difficulty.value = trail.difficulty;
        form.description.value = trail.description;
        form.altitude.value = trail.altitude;
        form.duration.value = trail.duration;
        form.season.value = trail.season;
        form.dataset.editId = trail.id;

        showTrailForm();
    } catch (error) {
        showAlert('Error loading trail details', 'error');
    }
}

// Guides Management
async function loadGuides() {
    const guides = await fetchData('guides');
    guidesTable.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Specialty</th>
            <th>Description</th>
            <th>Actions</th>
        </tr>
    `;

    guides.forEach(guide => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${guide.name}</td>
            <td>${guide.specialty}</td>
            <td>${guide.description}</td>
            <td>
                <button onclick="deleteGuide(${guide.id})" class="delete-btn">Delete</button>
            </td>
        `;
        guidesTable.appendChild(row);
    });
}

async function deleteGuide(id) {
    if (confirm('Are you sure you want to delete this guide?')) {
        if (await deleteItem('guides', id)) {
            loadGuides();
        }
    }
}

guidesForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(guidesForm);

    try {
        const response = await fetch('/api/guides', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Network response was not ok');
        showAlert('Guide added successfully');
        guidesForm.reset();
        loadGuides();
    } catch (error) {
        showAlert(`Error adding guide: ${error.message}`, 'error');
    }
});


// Gallery Management
async function loadGallery() {
    const gallery = await fetchData('gallery');
    galleryTable.innerHTML = `
        <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
        </tr>
    `;

    gallery.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.description}</td>
            <td>
                <button onclick="deleteGalleryItem(${item.id})" class="delete-btn">Delete</button>
            </td>
        `;
        galleryTable.appendChild(row);
    });
}

async function deleteGalleryItem(id) {
    if (confirm('Are you sure you want to delete this gallery item?')) {
        if (await deleteItem('gallery', id)) {
            loadGallery();
        }
    }
}

galleryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(galleryForm);

    try {
        const response = await fetch('/api/gallery', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Network response was not ok');
        showAlert('Gallery item added successfully');
        galleryForm.reset();
        loadGallery();
    } catch (error) {
        showAlert(`Error adding gallery item: ${error.message}`, 'error');
    }
});

async function fetchData(endpoint) {
    try {
        const response = await fetch(`/api/${endpoint}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        showAlert(`Error fetching ${endpoint}: ${error.message}`, 'error');
        return [];
    }
}

async function deleteItem(endpoint, id) {
    try {
        const response = await fetch(`/api/${endpoint}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Network response was not ok');
        showAlert(`Item deleted successfully`);
        return true;
    } catch (error) {
        showAlert(`Error deleting item: ${error.message}`, 'error');
        return false;
    }
}

// Initialize all data
document.addEventListener('DOMContentLoaded', () => {
    loadTrails();
    loadGuides();
    loadGallery();
    if (trailsForm) {
        trailsForm.addEventListener('submit', handleTrailSubmit);
    }
});

// Placeholder functions -  These need to be implemented based on your actual form structure
function showTrailForm() {
    document.getElementById('addTrailForm').style.display = 'block';
}

function hideTrailForm() {
    document.getElementById('addTrailForm').style.display = 'none';
}