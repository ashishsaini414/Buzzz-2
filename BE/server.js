const express = require("express");
const app = express()
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const routes= require("./Components/routes")
const session = require("express-session");
const cookieParser = require("cookie-parser")
dotenv.config({ path: "./development.env"})

const port = process.env.PORT || 8000

app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
app.use(routes)

const DB = process.env.DB;

mongoose.connect(DB,{
    useNewUrlParser: true
})

mongoose.connection.on("error",(err)=>{
    console.log("error", err)
})

mongoose.connection.on("connected",()=>{
    console.log("Mongoose is connected")
})

app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

app.listen(port,()=>{
    console.log("Server is listening to this port - ", port)
})