const express = require('express');
const User = require('./models/User');
const mongoose=require('mongoose')

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, mobile, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const newUser = new User({ firstname, lastname, mobile, email, password, role });

        await newUser.save();

        // If user is an Owner, return the newly created _id as ownerId
        const responseUser = newUser.toObject();
        if (role === "Owner") {
            responseUser.ownerId = newUser._id;
        }

        res.status(201).json({ message: "User Registered Successfully", user: responseUser });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Route to get User Data
router.get('/user/:id', async (req, res) => {
    try {
        console.log("Received User ID:", req.params.id); // Debugging ✅

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).json({ message: "Error getting User Data" });
    }
});



// Route to Update User Data
router.put('/user/:id',async(req,res)=>{
    try{
        const UpdateUser=await User.findByIdAndUpdate(req.params.id, req.body,{new: true});
        res.json(UpdateUser);
    }
    catch(err)
    {
        res.status(500).json({message: "Error Updating User Input"});
    }
});

//Route to Delete User Data
router.delete('/user/:id',async(req,res)=>{
    try{
        const DeleteUser=await User.findByIdAndDelete(req.params.id);
        res.json({message: "User Account Deleted"});
    }
    catch(err)
    {
        res.status(500).json({message: "Error Deleting the Account"});
    }
});

// User Login (No password hashing, so direct comparison)
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (user.role !== role) {
            return res.status(403).json({ message: "Role mismatch, please select the correct role" });
        }

        res.json({ 
            message: "Login successful", 
            user: { _id: user._id, email: user.email, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});
module.exports = router;