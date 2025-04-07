const mongoose = require('mongoose');

const pgSchema = new mongoose.Schema({
    name: String,
    address: String,
    gender: String,
    weekdaysMeals: String,
    weekendsMeals: String,
    mealType: String,
    openTime: String,
    closeTime: String,
    singleRoom: Number,
    doubleRoom: Number,
    mobile: Number,
    imageUrl: String,
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', immutable: true }

});

module.exports = mongoose.model('PG', pgSchema, 'pg_listings');
