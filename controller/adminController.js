const Admin = require('../models/admin')
const Leave = require("../models/leaveapplication")
const complaint = require('../models/complaint')
const Qrtokens = require('../models/qrtokens')
const User = require('../models/user')
const CollegeHostelRoom = require('../models/hostel')
const Announcement = require("../models/announcement")
const BigPromise = require('../middlewares/bigPromise')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const feedback = require('../models/feedback')


exports.signup = BigPromise(async (req, res, next) => {

    const { name, email, password, url, collegeid, phone } = req.body
    if (!email || !name || !password) {
        return next(new Error("Name ,email and password are required"))
    }


    const user = await Admin.create({
        name,
        email,
        password,
        url: req.body.url1,
        collegeid,
        phone,
    })
    // console.log(user)
    //method to generte a cookie with the token generated with the expiry date ...........................
    res.status(200).json({
        name,
        email,
        token: user.getJwtToken()
    })

})

exports.signin = BigPromise(async (req, res) => {

    const { email, password } = req.body

    const user = await Admin.findOne({ email: email }).select("+password")
    if (!user) {
        return res.status(401).json({
            message: "User does not exsist Plz Signup"
        })
    }

    if (!await bcrypt.compare(password, user.password)) {

        return res.status(401).json({
            message: "Password does not match "
        })
    }
    const token = user.getJwtToken()
    res.status(200).json({
        user,
        token
    })

})
exports.adminprofile = BigPromise(async (req, res) => {

    const id = req.user._id
    const user = await Admin.findById(id);

    res.status(200).json({
        user
    })
})
exports.editImage = BigPromise(async (req, res) => {
    try {
        const id = req.user._id
        const user = await Admin.findByIdAndUpdate(id,
            {
                url: req.body.url
            });
        // console.log(user);
        // console.log("--------------");
        res.status(200).json({

        })
    }
    catch (error) {
        console.log(error);
    }
})
exports.editAdminProfile = BigPromise(async (req, res) => {
    try {
        const id = req.user._id
        const user = await Admin.findByIdAndUpdate(id, req.body, {
            new: true
        });
        // console.log(user);
        res.status(200).json({

        })
    }
    catch (error) {
        console.log(error);
    }
})


exports.getHostelDetails = BigPromise(async (req, res, next) => {

    const hostel_names = await CollegeHostelRoom.find().distinct('hostelName');
    const all_hostel = await CollegeHostelRoom.find()
    res.status(200).json({
        hostel_names,
        all_hostel
    })

})
exports.createHostel = BigPromise(async (req, res) => {
    try {
        // Create hostels with blocks and rooms

        const { hostelName, blocks } = req.body;

        const existingHostel = await CollegeHostelRoom.findOne({ hostelName: hostelName });
        if (existingHostel) {
            return res.status(400).json({ error: 'Hostel with the same name already exists.' });
        }

        // Create new hostel with blocks and rooms
        const hostel = {
            hostelName,
            blocks
        };


        // Iterate through each hostel
        // Iterate through each block
        for (const block of hostel.blocks) {
            // Create rooms for the block
            for (let i = 1; i <= block.numberOfRooms; i++) {
                const roomNumber = `${block.blockName.charAt(6)}${i}`.padStart(3, '0');
                const newRoom = new CollegeHostelRoom({
                    hostelName: hostel.hostelName,
                    block: block.blockName,
                    roomNumber: roomNumber
                    // You can add more properties here if needed
                });
                await newRoom.save();
            }
        }
        // console.log('Hostels, blocks, and rooms created successfully.');
        res.status(200).json({ message: 'Hostels, blocks, and rooms created successfully.' });
    } catch (error) {
        console.error('Error creating hostels, blocks, and rooms:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

exports.deleteHostel = BigPromise(async (req, res) => {
    try {
        const { hostelName } = req.body;

        // Check if hostel exists
        const existingHostel = await CollegeHostelRoom.findOne({ hostelName: hostelName });
        if (!existingHostel) {
            return res.status(400).json({ error: 'Hostel does not exist.' });
        }

        // Delete the hostel
        await CollegeHostelRoom.deleteMany({ hostelName: hostelName });

        // console.log(`Hostel '${hostelName}' deleted successfully.`);
        res.status(200).json({ message: `Hostel '${hostelName}' deleted successfully.` });
    } catch (error) {
        console.error('Error deleting hostel:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

exports.deleteStudentInfo = BigPromise(async (req, res) => {
    try {
        const id = req.params.id;
        await feedback.deleteMany({ id })
        await Leave.deleteMany({ id })
        await complaint.deleteMany({ id })
        await Qrtokens.deleteMany({ user:id })
        const hos = await CollegeHostelRoom.updateMany(
            { studentIds: id },
            { $pull: { studentIds: id } }
        );
        res.status(200).json({ message: `Student hostel info deleted successfully.` });

    } catch (error) {
        console.error('Error deleting Student Info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteStudent = BigPromise(async (req, res) => {
    try {
        const id = req.params.id;
        await feedback.deleteMany({ id })
        await Leave.deleteMany({ id })
        await complaint.deleteMany({ id })
        await Qrtokens.deleteMany({ user:id })
        const hos = await CollegeHostelRoom.updateMany(
            { studentIds: id },
            { $pull: { studentIds: id } }
        );
        await User.deleteOne({_id:id})
        res.status(200).json({ message: `Student deleted successfully.` });

    } catch (error) {
        console.error('Error deleting Student :', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteAnnouncement = BigPromise(async (req, res) => {
    try {
        const id = req.params.id;

        // Check if hostel exists
        const result = await Announcement.findByIdAndDelete(id);
        if (!result) {
            return res.status(400).json({ error: 'Announcement does not exist.' });
        }
        // console.log(`Hostel '${hostelName}' deleted successfully.`);
        res.status(200).json({ message: `Announcement deleted successfully.` });
    } catch (error) {
        console.error('Error deleting Announcement:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

exports.getStudentHostel = BigPromise(async (req, res, next) => {
    const user = req.params.id;
    const result = await CollegeHostelRoom.find({ studentIds: user })
    res.status(201).json({
        result
    })
})
exports.hostelFormDetails = BigPromise(async (req, res, next) => {
    const hostelName = await CollegeHostelRoom.distinct("hostelName")
    const name_block = [];
    for (let i = 0; i < hostelName.length; i++) {
        const blockName = await CollegeHostelRoom.distinct("block", { "hostelName": hostelName[i] })
        name_block.push({ hostelName: hostelName[i], blockName: blockName })
    }
    const hostelDetails = []
    for (let i = 0; i < name_block.length; i++) {
        const roomNumber = []
        for (let j = 0; j < name_block[i].blockName.length; j++) {
            const roomNo = await CollegeHostelRoom.distinct("roomNumber", { "hostelName": name_block[i].hostelName, "block": name_block[i].blockName[j] })
            roomNumber.push(roomNo)
        }
        hostelDetails.push({ hostelName: name_block[i].hostelName, blockName: name_block[i].blockName, roomNumber: roomNumber })
    }
    res.status(200).json({
        hostelDetails
    })
})
exports.getUniqueHostelNames = BigPromise(async (req, res, next) => {
    const hostelName = await CollegeHostelRoom.distinct("hostelName")
    hostelName.push("All");
    res.status(200).json({
        hostelName
    })
})

exports.createAnnouncement = BigPromise(async (req, res, next) => {
    const { hostelName, url, announcement } = req.body
    const result = await Announcement.create({
        hostelName: hostelName,
        url: url,
        announcement: announcement
    })

    res.status(200).json({
        result
    })
})

exports.showAllAnnouncements = BigPromise(async (req, res, next) => {
    const hostelName = await CollegeHostelRoom.distinct("hostelName")
    const result = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json({
        result, hostelName
    })
})
exports.showStudentAnnouncements = BigPromise(async (req, res, next) => {
    const user = req.user._id;
    const hostel_student = await CollegeHostelRoom.find({ studentIds: user })
    const hostelName1 = hostel_student[0].hostelName
    const op = await Announcement.find({ hostelName: hostelName1 })
    const hostelName = await CollegeHostelRoom.distinct("hostelName")
    const all = await Announcement.find({ hostelName: 'All' })
    const result = op.concat(all);
    res.status(200).json({
        result, hostelName
    })
})

exports.getsingleAnnouncement = BigPromise(async (req, res, next) => {
    const user = req.params.id;
    const result = await Announcement.findOne({ _id: user })
    res.status(200).json({
        result
    })
})
exports.updateAnnouncement = BigPromise(async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Announcement.findByIdAndUpdate(id, req.body, {
            new: true
        });
        // console.log(user);

        res.status(200).json({
            message: 'Announcement updated successfully',
            updatedAnnouncement: user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while updating the announcement'
        });
    }
});