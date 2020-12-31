
/* To enable this snippet, type 'express' */ 
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser')
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
// const bcrypt = require("bcrypt")
// const saltRounds = 10;
// const md5 = require('md5')
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



app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());




mongoose.connect("mongodb://localhost:27017/userDB", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

// const secret = process.env.SECRET
// userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);
/* In order to get 'ejs' working, */
/* view documentation on https://ejs.co/ */
/* to use ejs tags and to use render methods as well. */

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function(req,res) {
    res.render("home");
});

app.get('/login', function(req,res) {
    res.render("login");
});

app.post('/login', function(req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if (err) {
            console.log(err)
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            })
        }
    })

});

app.get('/register', function(req,res) {
    res.render("register");
});

app.get('/secrets', function(req, res){
    if (req.isAuthenticated()) {
        res.render("secrets")
    } else {
        res.render("login")
    }
})

app.post("/register", function(req,res) {
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if (err) {
            console.log(err)
            res.redirect("/register")
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets")
            })
        }
    })
 
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/")
})

app.listen(3000, function(){
    console.log('You are listening to Port:3000');
});