const express   = require("express")
const http      = require("http")
const https     = require("https")
const requestIp = require("request-ip")
const fs        = require("fs")
const mysql     = require("mysql")



let server = http.createServer()


/////////////////////////////////////////////
//conf express
let app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json({limit: "10MB"}))



app.post("/createURL",(req, res, next)=>{

})




app.get("/url/:TOKEN", (req, res, next)=>{
  let user =
  {
    date = New Date();
    ip   = requestIp.getClientIp(req) || "NO IP";
  }

  req.params.TOKEN

  let date = New Date();

  
})


app.post("/user/info", (req, res, next)=>{

})