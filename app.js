const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const { json } = require('body-parser');
const { copyFileSync } = require('fs');
const apiKey = "9d52a5f94cd635417a0a227acfea8f5a-us14";
const listId = "da388fed0d";
const url = "https://us14.api.mailchimp.com/3.0/lists/da388fed0d";

app.use(bodyParser.urlencoded({extended: true}));

// don't need to write app.get() for every static page like css and image files
app.use(express.static("public"));

// requesting for home route from our server 
app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;
    // console.log(firstName + " " + lastName + " " + email);

    var data = {
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

    const jsonData = JSON.stringify(data); // flatten it
    const options = {
      method: "POST",
      auth: "dracula145:9d52a5f94cd635417a0a227acfea8f5a-us14", // any string(username) : apikey
    };

    const request = https.request(url, options, function(respose){
        if(respose.statusCode === 200) res.sendFile(__dirname + "/success.html");
        else res.sendFile(__dirname + "/failure.html");
        respose.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
    
})

app.post("/failure", (req,res) =>{
    res.redirect("/");
})

// we were locally running our server on port 3000 but heroku may choose any port .. so process.env.PORT
app.listen(process.env.PORT || 3000, () => console.log("Server started on port 3000"));