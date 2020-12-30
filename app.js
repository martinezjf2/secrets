
/* To enable this snippet, type 'express' */ 
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser')
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5')
// const encrypt = require("mongoose-encryption");

/* To use bodyParser, you can use the */
/* req.body.<name_attribute_from_html>, */
/* to retrieve data from a html form. */

/* To use any CSS file, you would have to */
/* 'link the stylesheet to the HTML document, */
/* and create a public directoy, containing a css directory. */
/* After creating, this directories, and adding the link to the HTML, */
/* you have to explicitly tell express to use the public files */
/* with adding line above these comments. */

const app = express();
app.set('view engine', 'ejs')
app.use(express.static('public'))


mongoose.connect("mongodb://localhost:27017/userDB", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

// const secret = process.env.SECRET
// userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);
/* In order to get 'ejs' working, */
/* view documentation on https://ejs.co/ */
/* to use ejs tags and to use render methods as well. */

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function(req,res) {
    res.render("home");
});

app.get('/login', function(req,res) {
    res.render("login");
});

app.post('/login', function(req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}, function(err, foundUser){
        if (err){
            console.log(err)
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets")
                }
            }
        }
    });
});

app.get('/register', function(req,res) {
    res.render("register");
});

app.post("/register", function(req,res) {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.listen(3000, function(){
    console.log('You are listening to Port:3000');
});