const express = require("express")
const mongoose = require("mongoose")
const route = require("./route/route")
const app = express()

app.use(express.json())

mongoose.set('strictQuery', true)

mongoose.connect("mongodb+srv://prageet:4zGItzVIrinYLkAI@myproject.kthcntq.mongodb.net/vaccination-slot-allotment", { useNewUrlParser: true })
.then(() => console.log("MongoDb is connected"))
.catch(err => console.log(err))

app.use("/", route)

app.listen(3000, function () { console.log("running on 3000") })