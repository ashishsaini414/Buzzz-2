const express = require("express");
const app = express()
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const routes= require("./Components/routes")
const session = require("express-session");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")
dotenv.config({ path: "./development.env"})

const port = process.env.PORT || 8000

app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

app.use((req, res, next)=>{
    // console.log(req.url)
    if(req.url === "/googleLogin"){
        next()
    }
    else{
        if(req.headers.authorization){
            const token = req.headers.authorization.split(" ")[1]
            jwt.verify(token,process.env.JWT_SECRET_KEY,function(err, payload){
                if(err) {
                    console.log("error",err);
                    res.status(403).json({error : err.message})
                }
                else if(payload){
                    // console.log("data after verify",payload);
                    next();
                }
            })
        }
        else{
            // console.log("not authorized")
            res.status(401).json({ error: 'Unauthorized' });
        }
    }
    
})

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