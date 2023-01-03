const userModel = require('../model/userModel')
const bcyrpt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { isValidObjectId } = require("mongoose")
const { isValidPhone, isValidString, isValidAge, isValidPincode, isValidAadharNo, isValidPassword, isValidDose, isValidBody, isvalidSlot } = require('../validation/validation')

const createUser = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "provide data to create" })
        let { Name, PhoneNumber, Age, Pincode, AadharNo, Dose, Password } = data

        let arr = Object.keys(data)
        for (i = 0; i < arr.length; i++) {
            if (arr[i].trim() == "") return res.status(400).send({ status: false, message: `please provide data for  ${arr[i]}` })
        }

        if (!data.Name) return res.status(400).send({ status: false, message: "Provide name" })
        if (!isValidString(Name)) return res.status(400).send({ status: false, message: "provide valid name" })

        if (!data.PhoneNumber) return res.status(400).send({ status: false, message: "Provide PhoneNumber" })
        if (!isValidPhone(PhoneNumber)) return res.status(400).send({ status: false, message: "provide valid PhoneNumber" })
        let checkPhone = await userModel.findOne({ PhoneNumber: PhoneNumber })
        if (checkPhone) return res.status(400).send({ status: false, message: "phone already exist" })

        if (!data.Age) return res.status(400).send({ status: false, message: "Provide Age" })
        if (!isValidAge(Age)) return res.status(400).send({ status: false, message: "provide valid Age" })

        if (!data.Pincode) return res.status(400).send({ status: false, message: "Provide Pincode" })
        if (!isValidPincode(Pincode)) return res.status(400).send({ status: false, message: "provide valid Pincode" })

        if (!data.AadharNo) return res.status(400).send({ status: false, message: "Provide AadharNo" })
        if (!isValidAadharNo(AadharNo)) return res.status(400).send({ status: false, message: "provide valid AadharNo" })
        let checkAadharno = await userModel.findOne({ AadharNo: AadharNo })
        if (checkAadharno) return res.status(400).send({ status: false, message: "Aadhar number already exist" })

        if (data.hasOwnProperty(Dose)) {
            data.Dose = Dose.toLowercase()
            if (!data.Dose) return res.status(400).send({ status: false, message: "Provide Dose" })
            if (!isValidDose(Dose)) return res.status(400).send({ status: false, message: "provide valid Dose" })
        }

        if (!data.Password) return res.status(400).send({ status: false, message: "Provide password" })
        if (!isValidPassword(Password)) return res.status(400).send({ status: false, message: "provide valid Password" })

        let encrptPassword = await bcyrpt.hash(data.Password, 10)
        data.Password = encrptPassword

        const create = await userModel.create(data)
        return res.status(201).send({ status: true, message: "created succesufully", data: create })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const loginUser = async function (req, res) {
    try {
        let data = req.body
        let { PhoneNumber, Password } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "provide credentails to login" })

        let verifyCredentials = await userModel.findOne({ PhoneNumber: PhoneNumber }, { Password: Password })
        if (!verifyCredentials) { return res.status(404).send({ status: false, message: "User not found" }) }

        let hash = verifyCredentials.Password
        let matchPassword = await bcyrpt.compare(Password.trim(), hash)
        if (!matchPassword) return res.status(400).send({ status: false, message: "please provide correct password" })

        let token = jwt.sign({ userId: verifyCredentials._id }, "anonymus007")
        return res.status(200).send({ status: true, message: "User login successfull", data: token })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const slotRegistration = async function (req, res) {
    try {
        const userId = req.params.userId

        data = req.body

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Please provide valid User Id" })
        let userdata = await userModel.findById(userId)
        if (!userdata) return res.status(404).send({ status: false, message: "user not found" })
        if (userdata.registeredSlot.registered) return res.status(404).send({ status: false, message: `user allrady registored for slot ${userdata.registeredSlot}` })

        if (!isValidBody(data)) return res.status(400).send({ stataus: false, msg: "please provide data" })

        const { centerId, slot, date } = data

        if (!centerId) return res.status(400).send({ status: false, message: "centerId is required" })
        if (!isValidObjectId(centerId)) return res.status(400).send({ status: false, message: "Please provide valid centerId" })
        let centerData = await centerModel.findById(centerId)
        if (!centerData) return res.status(404).send({ status: false, message: "center not found" })

        if (!slot) return res.status(400).send({ status: false, message: "Slot is required" })
        if (!isvalidSlot(slot)) return res.status(400).send({ status: false, message: "Please provide valid slot" })

        const slotArr = centerData.avalableSlots
        for (let i = 0; i < slotArr.length; i++) {
            if (slotArr[i].slot == slot) {
                if (slotArr[i].avalableDose == 0) return res.status(400).send({ status: false, message: "Slot not avalable, plese take apoinment for other slot" })
                slotArr[i].avalableDose -= 1
            }
        }

        const registeredSlot = {
            registered: true,
            date: date,
            time: slot
        }

        const registor = await userModel.findByIdAndUpdate(userId, { $set: { registeredSlot: registeredSlot } }, { new: true }).select({ password: 0 })
        await centerModel.findByIdAndUpdate(centerId, { $set: { avalableSlots: slotArr } }, { new: true })
        return res.status(200).send({ status: true, message: `user Appinment booked successfully on ${date} at ${slot}`, data: registor })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createUser, loginUser, slotRegistration }