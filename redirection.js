

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
app.use(express.json())
app.use(express.urlencoded({extended: true}))

/*
create table user(
  id INT AUTO_INCREMENT PRIMARY KEY,
  IP VARCHAR(255) NOT NULL,
)


create table redirect(
  id INT AUTO_INCREMENT PRIMARY KEY,
  FROM_URL VARCHAR(255) NOT NULL,
  TO_URL VARCHAR(255) NOT NULL,
  ENDTIME TIMESTAMP NOTNULL,
)

*/

checkValide(url)
{
  let date = new Date(url)
  return ( Date.now() - date ) 
}



app.get("/:TOKEN", (req, res, next)=>{
  }


  console.log(`NEW USER IP => ${requestIp.getClientIp(req)} IS LANDING ON PAGE => ${req.url}`)

  con.query("SELECT FROM_URL FROM WHERE FROM_URL=?", req.path, (err, result, fields)=>{
    if(err){return res.status(500).json({err: "error not url found"})}
    if(!lenght){return res.status(500).json(err: "error not url found")}
    if(!checkValide(result[0].ENDTIME)){return res.status.json({err: "error url not valide"})}
    res.status(200).json({url: result.TO_URL})
  })
})



////possibilité ??? a check merci => 
//https://developer.mozilla.org/fr/docs/Web/API/Window
//https://www.w3schools.com/js/js_window.asp
app.post("/user/info", (req, res, next)=>{
  let user = {
    date = New Date();
    ip   = requestIp.getClientIp(req) || "NULL";
    navigator = req.body.navigator || "NULL";    //window.navigator.appVersion
    os = req.body.os || "NULL"; //windows.navigator.platform

  }

})