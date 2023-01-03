const express = require("express")
const route = express.Router()
const { createUser, loginUser, slotRegistration } = require("../controller/userController")
const { createCenter, getCenter } = require("../controller/vaccineController")

route.post("/register", createUser)
route.post("/login", loginUser)
route.post("/user/:userId", slotRegistration)

route.post("/center", createCenter)
route.get("/center", getCenter)

module.exports = route