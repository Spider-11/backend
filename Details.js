const express=require('express');
const router=express.Router();
const User=require('./models/User');

router.get('/Users',async(req,res)=>{
    try{
        const users=await User.find({role:'User'});
        res.json(users);
    }
    catch(error)
    {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.get('/Owners',async(req,res)=>{
    try{
        const owners=await User.find({role:'Owner'});
        res.json(owners)
    }
    catch(error)
    {
        res.status(500).json({message: "Server Error", error: error.message})
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.json({ message: "✅ User Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports=router;