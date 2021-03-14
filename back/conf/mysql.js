
//////////////////////////////////
//Configuration mysql

const fs    = require("fs")
const mysql = require("mysql")




let conf = fs.readFileSync("./conf.json")


conf = JSON.parse(conf);

let con = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  database: conf.database,
})


con.connect((err)=>{
  if(err){return console.error("MYSQL ERROR => " + err)}
  console.log("MYSQL CONNNECTION => OK " )
})



exports.mysql = con

//////////////////////////////////////////