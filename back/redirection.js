

const express   = require("express")
const http      = require("http")
const https     = require("https")
const requestIp = require("request-ip")
const fs        = require("fs")
const mysql     = require("mysql")
const ejs       = require("ejs")
const {Base64}  = require("js-Base64")
const crypto    = require("crypot")

let server = http.createServer()

const conf = JSON.parse( fs.readFileSync("./conf.json") )

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
  UUID VARCHAR(255) NOT NULL,
)
*/




checkValide(url)
{
  let date = new Date(url)
  return ( Date.now() - date ) 
}

function createTMPlink(req){
  return new Promise((resolve, reject)=>{
  
    let options = {
      redirect : "",
      sendLinks: "",
    }


    console.log(`NEW USER IP => ${requestIp.getClientIp(req)} IS LANDING ON PAGE => ${req.url}`)
    //let token = crypto.randomByetes(50).toString("hex")

    con.query("SELECT FROM_URL FROM WHERE FROM_URL=?", req.path, (err, result, fields)=>{
      
      //ERROR CHECK
      if(err){reject( {err: "error not url found"})}
      if(!lenght){reject({err: "error not url found"})}
      if(!checkValide(result[0].ENDTIME)){reject({err: "error url not valide"})}
      
      //SUCCESS 
      options.redirect = result.TO_URL

      let url = `http://${conf.console.host}:${conf.console.port}/send/${result.UUID}`
      options.sendLinks = url
    })

    resolve(options)

  })
}


app.get("/:TOKEN", async (req, res, next)=>{
  try{
    let options = await getLinks(req)
    
    res.render("landing.ejs", options);
  }
  catch(error)
  {
    
  }



 
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
