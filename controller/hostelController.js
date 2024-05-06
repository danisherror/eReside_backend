const Hostel = require('../models/hostel');
const BigPromise = require('../middlewares/bigPromise');
exports.applyhostel = BigPromise(async (req, res, next) => {
    // Extract necessary information from request body
    const { hostelName, block, roomNumber } = req.body;
    const studentId = req.user._id
    console.log(hostelName, block, roomNumber)
    try {
        // Check if the specified room exists in the database
        const existingRoom = await Hostel.findOne({
            hostelName: hostelName,
            block: block,
            roomNumber: roomNumber
        });

        if (!existingRoom) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Check if the room is already full
        if (existingRoom.studentIds.length >= existingRoom.capacity) {
            return res.status(400).json({ error: 'Room is already full. Please choose another room.' });
        }

        // Update the student's hostel information in the database
        existingRoom.studentIds.push(studentId);
        await existingRoom.save();

        // Return success response
        res.status(200).json({ message: 'Hostel application successful', room: existingRoom });
    } catch (error) {
        console.error('Error applying hostel:', error);
        // Return error response
        res.status(500).json({ error: 'Internal server error' });
    }
});

