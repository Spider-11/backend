const express = require('express');
const multer = require('multer');
const PG = require('./models/PG'); // Ensure this model exists

const router = express.Router();

// Multer Storage for Image Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ✅ Ensure correct route path
router.post('/addpg', upload.single('image'), async (req, res) => {
    try {
        console.log("📥 PG Data:", req.body);
        console.log("📸 Uploaded Image:", req.file);

        if (!req.body.ownerId) {
            return res.status(400).json({ message: "❌ Owner ID missing! Please log in." });
        }

        const newPg = new PG({
            ...req.body,
            ownerId: req.body.ownerId, // ✅ Ensure ownerId is saved
            imageUrl: req.file ? `https://localhost:5000/uploads/${req.file.filename}` : ''
        });

        await newPg.save();
        res.status(201).json({ message: "✅ PG Added Successfully", pg: newPg });
    } catch (error) {
        console.error("❌ Error Adding PG:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


// API to Get All PG Listings
router.get('/list', async (req, res) => {
    try {
        const pgs = await PG.find();
        res.json(pgs);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;