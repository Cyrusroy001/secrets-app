require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    // encryption happens when save runs
    newUser.save(function(err) {
        if(err) console.log(err);
        // only renders when user is registered
        else res.render("secrets");
    });
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);

    // decryption happens when find runs
    User.findOne(
        {email: username},
        function(err, foundUser) {
            if(err) console.log(err);
            else {
                if(foundUser) {
                    if(foundUser.password === password) {
                        // only renders when user is logged in
                        res.render("secrets");
                    } else {
                        console.log("Wrong password, try again.");
                    }
                }
            }
        }
    );
});

app.listen(3000, function() {
    console.log("Server up and running on port 3000.");
});