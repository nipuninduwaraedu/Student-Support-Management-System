const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    imageUrl: { type: String, default: '' }
}, { timestamps: true });
module.exports = mongoose.model('Event', EventSchema);
