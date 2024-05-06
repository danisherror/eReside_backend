const complaint = require('../models/complaint')
const BigPromise = require('../middlewares/bigPromise')
const Warden = require('../models/warden');
const Hostel = require('../models/hostel');

exports.addcomplaint = BigPromise(async (req, res, next) => {

    const { title, description } = req.body

    const result = await complaint.create({
        user: req.user._id,
        title: title,
        description: description
    })
    res.status(200).json({
        result
    })
})

exports.getcomplaint = BigPromise(async (req, res, next) => {

    const user = req.user._id
    const result = (await complaint.find({ user })).reverse()
    res.status(200).json({
        result
    })
})
exports.editcomplaint = BigPromise(async (req, res, next) => {

    const id = req.params.id;
    const { title, description } = req.body;

    await complaint.findByIdAndUpdate(id, {
        title: title,
        description: description
    })

    res.status(200).json({
        message: "SUCCESSFULLY UPDATED"
    })

})
exports.wgetStudentcomplaints = BigPromise(async (req, res, next) => {
    const id = req.user._id;
    const warden = await Warden.findById(id);
    const hostelName = warden.hostelName;
    const rooms = await Hostel.find({ hostelName: hostelName });
    const user_id = [];
    for (let i = 0; i < rooms.length; i++) {
        const op = rooms[i].studentIds;
        for (let j = 0; j < op.length; j++) {
            user_id.push(op[j]);
        }
    }
    const result = []
    for (let i = 0; i < user_id.length; i++) {
        const iid = user_id[i];
        const result1 = await complaint.find({ user: iid });
        result.push(...result1)
    }
    res.status(200).json({
        result
    })
})
exports.getStudentcomplaints = BigPromise(async (req, res, next) => {

    const result = await (await complaint.find()).reverse()
    res.status(200).json({
        result
    })
})
exports.editstudentcomplaintstatus = BigPromise(async (req, res, next) => {
    const id = req.params.id;
    const { title, description, status } = req.body;
    await complaint.findByIdAndUpdate(id, req.body, {
        new: true
    });

    res.status(200).json({
        message: "SUCCESSFULLY UPDATED"
    })
})
exports.getsinglecomplaint = BigPromise(async (req, res, next) => {

    const user = req.params.id
    const result = await complaint.findById(user)
    res.status(200).json({
        result
    })
})
exports.deleteComplaint = BigPromise(async (req, res) => {
    try {
        const id=req.params.id;

        // Check if hostel exists
        const result = await complaint.findByIdAndDelete(id);
        if (!result) {
            return res.status(400).json({ error: 'Complaint does not exist.' });
        }
        // console.log(`Hostel '${hostelName}' deleted successfully.`);
        res.status(200).json({ message: `Complaint deleted successfully.` });
    } catch (error) {
        console.error('Error deleting Complaint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});