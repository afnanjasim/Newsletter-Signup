const express = require("express")
const https = require("https")
const app = express();
const bodyParser = require("body-parser");
const { response } = require("express");
app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public")) // for using static files like static css

app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/signup.html")
})

app.post("/",(req,res)=>{
    var fName = req.body.fName
    var lName = req.body.lName
    var email = req.body.email

    var data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)
    const url = " {mailchimp server url}"
    const options={
        method: "POST",
        auth: "anyusername:{apikey}"

    }
    const request = https.request(url,options, (response)=>{

        if (response.statusCode===200) {
            res.sendFile(__dirname+"/success.html")
        } else {
            res.sendFile(__dirname+"/failure.html")
        }

        response.on("data", (data)=>{
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData)
    request.end()
})

app.post("/failure",(req,res)=>{
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function() {  // process is used while deploying in web server
    console.log("server is running on port 3000");
})

