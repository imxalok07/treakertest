const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'attached_assets/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Data storage paths
const TRAILS_FILE = 'data/trails.json';
const GUIDES_FILE = 'data/guides.json';
const GALLERY_FILE = 'data/gallery.json';

// Ensure data directory exists
if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
}

// Initialize empty data files if they don't exist
[TRAILS_FILE, GUIDES_FILE, GALLERY_FILE].forEach(file => {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, '[]');
    }
});

// Middleware
app.use(express.json());
app.use(express.static('.'));

// API Routes
app.get('/api/trails', (req, res) => {
    const trails = JSON.parse(fs.readFileSync(TRAILS_FILE));
    res.json(trails);
});

app.post('/api/trails', upload.single('trailImage'), (req, res) => {
    try {
        const trails = JSON.parse(fs.readFileSync(TRAILS_FILE));
        const trailData = req.body;

        const newTrail = {
            id: parseInt(trailData.editId) || Date.now(),
            name: trailData.trailName,
            difficulty: trailData.difficulty,
            description: trailData.description,
            altitude: parseInt(trailData.altitude),
            duration: parseInt(trailData.duration),
            season: trailData.season,
            image: req.file ? 'attached_assets/' + req.file.filename : (trailData.existingImage || '')
        };

        const existingIndex = trails.findIndex(t => t.id === newTrail.id);
        if (existingIndex !== -1) {
            if (!req.file) {
                newTrail.image = trails[existingIndex].image;
            }
            trails[existingIndex] = newTrail;
        } else {
            trails.push(newTrail);
        }

        fs.writeFileSync(TRAILS_FILE, JSON.stringify(trails, null, 2));
        res.json(newTrail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/trails/:id', (req, res) => {
    try {
        let trails = JSON.parse(fs.readFileSync(TRAILS_FILE));
        trails = trails.filter(trail => trail.id !== parseInt(req.params.id));
        fs.writeFileSync(TRAILS_FILE, JSON.stringify(trails, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Similar routes for guides and gallery
app.get('/api/guides', (req, res) => {
    const guides = JSON.parse(fs.readFileSync(GUIDES_FILE));
    res.json(guides);
});

app.post('/api/guides', upload.single('image'), (req, res) => {
    try {
        const guides = JSON.parse(fs.readFileSync(GUIDES_FILE));
        const newGuide = {
            id: Date.now(),
            ...req.body,
            image: req.file ? req.file.filename : ''
        };
        guides.push(newGuide);
        fs.writeFileSync(GUIDES_FILE, JSON.stringify(guides, null, 2));
        res.json(newGuide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/guides/:id', (req, res) => {
    try {
        let guides = JSON.parse(fs.readFileSync(GUIDES_FILE));
        guides = guides.filter(guide => guide.id !== parseInt(req.params.id));
        fs.writeFileSync(GUIDES_FILE, JSON.stringify(guides, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(5000, '0.0.0.0', () => {
    console.log('Server running on port 5000');
});