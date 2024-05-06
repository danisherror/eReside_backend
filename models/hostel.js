const mongoose = require('mongoose');

const collegeHostelRoomSchema = new mongoose.Schema({
    hostelName: {
        type: String,
        required: [true, 'Please provide the hostel name']
    },
    block: {
        type: String,
        required: [true, 'Please provide the block/building name']
    },
    roomNumber: {
        type: String,
        required: [true, 'Please provide a room number'],
        maxlength: [10, 'Room number should be under 10 characters']
    },
    type: {
        type: String,
        default: 'Double' // Assuming all rooms are double occupancy
    },
    studentIds: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }],
    },
    capacity: {
        type: Number,
        default: 2 // Double occupancy room
    },
    status: {
        type: String,
        default: 'available' // Assuming 'available' as default status, change as needed
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true });

const CollegeHostelRoom = mongoose.model('CollegeHostelRoom', collegeHostelRoomSchema);

module.exports = CollegeHostelRoom;
