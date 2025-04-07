const express =require('express');
const Booking=require('./models/Booking');
const router=express.Router();

//User creates a booking request
router.post("/book", async (req, res) => {
    try {
      const { userId, ownerId, pgId } = req.body;
  
      if (!userId || !ownerId || !pgId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Save booking to database
      const newBooking = new Booking({ userId, ownerId, pgId, status: "Pending" });
      await newBooking.save();
  
      res.status(201).json({ message: "Booking request sent successfully" });
    } catch (error) {
      console.error("Booking error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

//Owner views all bokiing requests
router.get('/owner/:ownerId', async (req, res) => {
    try {
        const { ownerId } = req.params; // ✅ Extract from req.params
        if (!ownerId) {
            return res.status(400).json({ error: "Owner ID is required" });
        }

        const bookings = await Booking.find({ ownerId }).populate("userId pgId");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: "Error fetching bookings", details: error.message });
    }
});

//Owner updates booking status (Approve/Deny)
router.put("/update/:bookingId",async(req,res)=>{
    try{
        const {status}=req.body;
        if(!["Approved","Denied"].includes(status))
        {
            return res.status(400).json({error: "Invalid status"});
        }
        await Booking.findByIdAndUpdate(req.params.bookingId,{status});
        res.json({message: `Booking${status}`})
    }
    catch(error)
    {
        res.status(500).json({error: "Error updating booking status"})
    }
})

//User checks booking status
const mongoose = require("mongoose");

router.get('/status/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Check if userId is valid
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid userId" });
        }

        const bookings = await Booking.find({ userId: new mongoose.Types.ObjectId(userId) })
            .populate("pgId ownerId");

        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Error fetching booking status" });
    }
});


module.exports=router;