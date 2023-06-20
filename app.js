//jshint esversion:6

// const express = require("express");
// const bodyParser = require("body-parser");
// const request = require("request");
// const app = express();

// const client = require("@mailchimp/mailchimp_marketing");
// client.setConfig({
//     apiKey: "da7b5651ac7821595b12c7e8409e360a-us21",
//     server: "us21",
// });

// async function add(member)  {
//     const response = await client.lists.addListMember("72c300d1f9", member);
    
// };

// app.post("/" , function(req, res){ 
//     const mail = req.body.email;
//     const password = req.body.pw;
 
//     const newMember = {email_address: mail , status: 'subscribed'};
    
//     add(newMember);
    
    
 
//     res.send('Form submitted.');
// });

// app.use(express.static("public")); //inorder for our server to serve the static files such as css and images we use this special function called static
// app.use(bodyParser.urlencoded({extended: true}));

// app.get("/",function(req,res){
//     res.sendFile(__dirname+"/signup.html");
// });

// app.post("/",function(req,res){

//     var fname = req.body.fname;
//     var lname = req.body.lname;
//     var email = req.body.email;

//     console.log(fname, lname,email);
// });

// app.listen(3000,function(req,res){
//     console.log("Server is runnig on port 3000");
// });


//API key
//da7b5651ac7821595b12c7e8409e360a-us21

//Audience ID
//72c300d1f9


 
/*const express = require("express");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");
client.setConfig({
  apiKey: "da7b5651ac7821595b12c7e8409e360a-us21",
  server: "us21",
});
 
const app = express();
 
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
 
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});
 
async function add(member)  {
    const response = await client.lists.addListMember("72c300d1f9", member);
};
 
app.post("/" , function(req, res){ 
    const fName = req.body.fname;
    const lName = req.body.lname;
    const email = req.body.email;

    console.log(fName, lName,email);
 
    const newMember = {email_address: email , 
            status: 'subscribed',
            merge_fields: {
                FNAME: fName,
                LNAME: lName,
            }};
    
    add(newMember);
 
    res.send('Form submitted.');
});
 
app.listen(3000, function(){
    console.log("Server is Running on Port 3000");
});*/



const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT||3000; //allows to run the app remotely as well as locally
// const request = require("request");
const https = require('https');
const API_KEY = "17910b2b40dd3cca0b56540f1cf3668b-us21";
const audianceID = "72c300d1f9"; 
 
 
app.use(express.static("public"));
 
app.listen(PORT, (req, res) => {
    console.log("App is listening on Port : ", PORT);
})
 
//redirect to signup page
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});
 
//setting bodyparser middleware
app.use(bodyParser.urlencoded({ extended: true }));
 
//signup route setting up post method and connecting to the mailchimp server
app.post('/', (req, res) => {
 
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
 
    //setting up data for mailchimp endpoint
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };
 
 
    const jsonData = JSON.stringify(data);
 
    const url = `https://us21.api.mailchimp.com/3.0/lists/${audianceID}`;
    const options = {
 
        method: "POST",
        headers: {
            Authorization: `auth ${API_KEY}`
        },
 
    }
 
    //setting up response for success & failure
    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            //res.send("success")
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
            //res.send("success")
        }
 
        // getting data 
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });
 
    // submitting data to mailchimp
    request.write(jsonData);
    request.end();
 
});
 
//redirect to the main page if failed
app.post("/failure", (req, res) => {
    res.redirect("/");
})