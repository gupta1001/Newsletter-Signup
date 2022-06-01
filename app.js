const express = require("express");
const axios = require("axios");
const https = require("https");
require("dotenv").config();

const app = express();
console.log(process.env);

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
// axios.get("https://gw.hellofresh.com/api/recipes/search?country=us&limit=9")
//     .then(response => {
//         console.log(response)
//         res.send("response") // <= send data to the client
//     })
//     .catch(err => {
//         console.log(err)
//         res.send({ err }) // <= send error
//     });

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    // console.log(firstName, lastName, email);
    // we will have single object in our members array
    // as we are only going to sign up one person at a time
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    console.log(jsonData);
    const member_id = process.env.MEMBER_ID;
    const api_key = process.env.API_KEY
    const url = "https://us17.api.mailchimp.com/3.0/lists/"+member_id;
    const options = {
        method: "POST",
        auth: "Prankur1:"+api_key,
        // headers: {
        //     'Content-Type': 'application/json',
        //   }
    }
    
    const request = https.request(url, options, function (response) {
        //console.log(response.statusCode); 
        response.on("data", function (data) {
            console.log(JSON.parse(data));
            // res.send(JSON.parse(data));
        });

        statusCode = response.statusCode;
        if (statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
    });
    request.on('error', (e) => {
        console.log(e);
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server has started on port 3000");
});