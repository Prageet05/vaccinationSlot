const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    Name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    PhoneNumber: { 
        type: String, 
        required: true 
    },
    Password: { 
        type: String, 
        required: true, 
        trim: true 
    },
    Age: { 
        type: Number, 
        required: true 
    },
    Pincode: { 
        type: Number, 
        required: true 
    },
    AadharNo: { 
        type: Number, 
        required: true 
    },
    Dose: { 
        type: String, 
        required: true, 
        default: "none", 
        enum: ["none", "first", "second"] 
    },
    registeredSlot: {
        registered: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date
        },
        time: {
            type: Number
        }
    },
}, { timestamps: true })

module.exports = mongoose.model("vaccineUser", userSchema)